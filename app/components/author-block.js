import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  newAuthorStub: function () {
    // Create closure so that this will be re-eveluated on every call.
    // If we did not do this, generation of unique id would fail plus we
    // really need a fresh object or we keep overwriting the same one
    return Ember.Object.create({
      importedAuthorName: '',
      id: this.generateUUID(),
      selectedAuthor: null,
      selectedInstitution: Ember.A([]),
      newAuthorForm: Ember.Object.create({
        firstName: '',
        lastName: '',
        year_of_birth: '',
        xaccount: '',
        orcid: ''
      })
    });
  },
  invalidSelectedDepartmentItems: Ember.A([]),

  init: function() {
    this._super(...arguments);
    if (this.get('authorArr').length === 0) {
      if (this.get('arrOfAuthorsFromImport') && this.get('arrOfAuthorsFromImport').length > 0) {
        this.get('arrOfAuthorsFromImport').forEach((author) => {
          this.send('addImportedAuthorRow', author);
        });
      }
      else {
        this.send('addEmptyAuthorRow');
      }
    }
  },

  totalNumberOfItems: Ember.computed('authorArr.[]', function() {
    //TODO: double check, array length javscript weirdness etc
    return this.get('authorArr').length;
  }),

  // Translates author header differently depending on publication type
  authorHeaderText: Ember.computed('selectedPublicationType', function(){
    var translation = this.get('i18n').t('components.authorBlock.authorHeaderTextStrong.' + this.get('selectedPublicationType.code')).toString();
    if (translation.indexOf('Missing translation') === 0){
      translation = this.get('i18n').t('components.authorBlock.authorHeaderTextStrong.default');
    }
    return translation;
  }),

  generateUUID: function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  },

  isThisTheOnlyAuthorRow: Ember.computed('authorArr.[]', function() {
    return this.get('authorArr').length === 1;
  }),

  invalidSelectedDepartmentsRowsCount: Ember.computed('invalidSelectedDepartmentItems.[]', function() {
    return this.get('invalidSelectedDepartmentItems.length');
  }),

  actions: {
    moveUp: function(id) {
      // First find the item and its index
      //TODO: Replace with ES6s findIndex when finds it's way into ember
      let authorArr = this.get('authorArr');
      let authorItem = authorArr.findBy('id', id);
      let authorItemIndex = authorArr.indexOf(authorItem);
      // If not already on top
      if (authorItemIndex > 0) {
        let authorItemAbove = authorArr.objectAt(authorItemIndex - 1);
        authorArr.removeAt(authorItemIndex);
        authorArr.insertAt(authorItemIndex, authorItemAbove);
        authorArr.removeAt(authorItemIndex - 1);
        authorArr.insertAt(authorItemIndex - 1, authorItem);
      }
    },
    moveDown: function(id) {
      // First find the item and its index
      //TODO: Replace with ES6s findIndex when finds it's way into ember
      let authorArr = this.get('authorArr');
      let authorItem = authorArr.findBy('id', id);
      let authorItemIndex = authorArr.indexOf(authorItem);
      // If not already at bottom
      if (authorItemIndex < authorArr.length - 1) {
        let authorItemBelow = authorArr.objectAt(authorItemIndex + 1);
        authorArr.removeAt(authorItemIndex);
        authorArr.insertAt(authorItemIndex, authorItemBelow);
        authorArr.removeAt(authorItemIndex + 1);
        authorArr.insertAt(authorItemIndex + 1, authorItem);
      }
    },
    addImportedAuthorRow: function(importedAuthor) {
      let author = this.newAuthorStub();
      author.set('newAuthorForm.firstName', importedAuthor.first_name);
      author.set('newAuthorForm.lastName', importedAuthor.last_name);
      author.set('importedAuthorName', [importedAuthor.first_name, importedAuthor.last_name].compact().join(' '));
      this.get('authorArr').addObject(author);
    },
    addEmptyAuthorRow: function() {
      this.get('authorArr').addObject(this.newAuthorStub());
    },
    removeAuthorRow: function(id) {
      let item = this.get('authorArr').findBy('id', id);
      this.get('authorArr').removeObject(item);
      // This case easy to miss, better/safer way to handle? Observer on remove only?
      this.get('invalidSelectedDepartmentItems').removeObject(item);
    },
    queryAuthorsResult: function(result) {
      let selected_authors_ids = this.get('authorArr').mapBy('selectedAuthor.id').compact();
      return result.filter(function(item) {
        return selected_authors_ids.indexOf(item.id) === -1;
      });
    },
    invalidSelectedDepartmentsPresent: function(item) {
      this.get('invalidSelectedDepartmentItems').addObject(item);
      this.get('invalidSelectedDepartmentItemsChanged')(this.get('invalidSelectedDepartmentItems'));
      //this.sendAction('invalidSelectedDepartmentItemsChanged', this.get('invalidSelectedDepartmentItems'));
    },
    invalidSelectedDepartmentsEmpty: function(item) {
      this.get('invalidSelectedDepartmentItems').removeObject(item);
      this.get('invalidSelectedDepartmentItemsChanged')(this.get('invalidSelectedDepartmentItems'));
      //this.sendAction('invalidSelectedDepartmentItemsChanged', this.get('invalidSelectedDepartmentItems'));
    }
  }
});
