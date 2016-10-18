import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  errors: null,
  departmentSuggestions: Ember.A([]),
  /*
  resetForm: function() {
    if (this.get("item.newAuthorForm")) {
      if(!this.get('item.importedAuthorName')) {
        this.set("item.newAuthorForm.firstName", '');
        this.set("item.newAuthorForm.lastName", '');
      }
      this.set("item.newAuthorForm.year_of_birth", '');
      this.set("item.newAuthorForm.xaccount", '');
      this.set("item.newAuthorForm.orcid", '');
    }
  },
  */
  init : function() {
    var setSuggestionStatuses = () => {
      let selected_ids = this.get('item.selectedInstitution').mapBy('id');
      this.get('departmentSuggestions').forEach((suggestion) => {
        suggestion.set('selected', selected_ids.indexOf(suggestion.get('department').id) !== -1);
      });
    };
    var setSuggestions = () => {
      let author_departments = this.get('item.selectedAuthor.departments');
      if (Ember.isArray(author_departments)) {
        this.set('departmentSuggestions', author_departments.map((department) => {
          let suggestion = Ember.Object.create(department);
          //TODO: Object cloned or not?
          suggestion.department = department;
          return suggestion;
        }));
      }
      else {
        this.set('departmentSuggestions', Ember.A([]));
      }
      // Also set selection statuses!
      setSuggestionStatuses();
    };
    this.addObserver('item.selectedAuthor', setSuggestions);
    this.addObserver('item.selectedInstitution', setSuggestionStatuses);

    this._super(...arguments);
    // Helper function for persisting new author items, returns promise
    this.set('createAuthor', (item) => {
      return new Promise((resolve, reject) => {
        this.store.save('person', {
          'first_name': item.newAuthorForm.get('firstName'),
          'last_name': item.newAuthorForm.get('lastName'),
          'year_of_birth': item.newAuthorForm.get('year_of_birth'),
          'xaccount': item.newAuthorForm.get('xaccount'),
          'orcid': item.newAuthorForm.get('orcid')
        }).then((model) => {
          item.set('selectedAuthor', model);
          item.set('transformedToNewAuthor', false);
          resolve(model); //Passing item, model or nothing here the right thing to do?
        }, (reason) => {
          reject(reason);
        });
      });
    });

    this.get('submitCallbacks').addObject(() => {
      if(this.get('isUnsaved')) {
        //TODO: user should be promted here!!
        // You have created a new Author, but not saved: "Save", "Discard", "Cancel"?
        return new Promise((resolve, reject) => {
          this.get('createAuthor')(this.get('item')).then((model) => {
            resolve();
          }, (reason) => {
            reject(reason);
          });
        });
      }
      return Promise.resolve();
    });
  },
  nonSelectedDepartmentSuggestions: Ember.computed('departmentSuggestions.@each.selected', function() {
    return this.get('departmentSuggestions').filterBy('selected', false);
  }),
  // Used to signal select2-adjusted component to set a default query string
  setDefaultQuery: Ember.computed('item.importedAuthorName', function() {
    return Ember.isPresent(this.get('item.importedAuthorName'));
  }),

  showInputFields: Ember.computed('item.importedAuthorName', 'addAffiliation', function() {
    return (this.get('item.importedAuthorName') && this.get('addAffiliation')) || !this.get('item.importedAuthorName');
  }),

  isImportedExternal: Ember.computed('item.importedAuthorName', 'addAffiliation', function() {
    return this.get('item.importedAuthorName') && !this.get('addAffiliation');
  }),

  //TODO: little bit uncertain about dependant properties
  isUnsaved: Ember.computed('item.transformedToNewAuthor', 'item.newAuthorForm.lastName', 'isImportedExternal', function() {
    return (this.get('item.transformedToNewAuthor') || this.get('isImportedExternal')) && !Ember.isBlank(this.get('item.newAuthorForm.lastName'));
  }),

  //isEmpty: Ember.computed('item.
  /*
  newAuthorFormVisible: function() {
    var self = this;
    if (this.get('item.transformedToNewAuthor')) {
      this.resetForm();
      Ember.run.later(function() {
        self.$().find('#first-name').focus();
      });
    }
  }.observes('item.transformedToNewAuthor'),
  */
  actions: {
    setMsgHeader: function(type, msg) {
      this.sendAction('setMsgHeader', type, msg);
    },
    queryAuthors: function(query, deferred) {
      //TODO: This utility function should be accessible to other classes
      // put it somewhere else, in service?
      function zipDepartments(doc, locale) {
        var departments = [];
        if (Ember.isArray(doc.departments_id)) {
          departments = doc.departments_id.map((department_id, index) => {
            return {
              id: department_id,
              name: doc['departments_name_' + locale][index],
              start_year: doc['departments_start_year'][index],
              end_year: doc['departments_end_year'][index],
            };
          });
        }
        return departments;
      }
      var result = this.store.find('person_record', {search_term: query.term});
      result.then((data) => {
        data = data.map((item) => {
          // Create presentation string
          let name = [item.first_name, item.last_name].compact().join(' ');
          let year = item.year_of_birth;
          let id = [item.xaccount, item.orcid].compact().join(', ');
          item.presentation_string = [name, year].compact().join(', ') + (id ? ' ' + ['(', id, ')'].join('') : '');
          item.departments = zipDepartments(item, this.get('i18n.locale'));
          return item;
        });
        if (this.get('queryAuthorsResult')) {
          data = this.get('queryAuthorsResult')(data);
        }
        deferred.resolve(data);
      }, function(reason) {
        //warning?
        console.error(reason);
        deferred.reject(reason);
      });
    },
    moveUpOne: function(id) {
      this.sendAction('moveUp', id);
    },

    moveDownOne: function(id) {
      this.sendAction('moveDown', id);
    },

    remove: function(id) {
      this.sendAction('removeAuthor', id);
    },

    toggleAddAffiliation: function() {
      this.toggleProperty('addAffiliation');
      Ember.run.schedule('afterRender', () => {
        var obj = this.$('.'+ this.get('item.id')).first();
        obj.select2('open');
      });
    },
    toggleAddNewAuthor: function(item) {
      item.toggleProperty('transformedToNewAuthor');
    },
    createAuthor: function(item) {
      this.get('createAuthor')(item).catch((reason) => {
        this.send('setMsgHeader', 'error', reason.error.msg);
        this.set('errors', reason.error.errors);
        //TODO: fix, schedule after render instead?
        Ember.run.later(function() {
          Ember.$('[data-toggle="popover"]').popover({
            placement: 'top',
            html: true
          });
        });
      });
    },
    addInstitution: function(institution) {
      // Add institution to selected array
      let selectedInstitutionCopy = Ember.copy(this.get('item.selectedInstitution'));
      // Have to overwrite value, since select2 observes "value"
      // (in this case bound to selectedInstitutions)
      // but is not smart enough to detect changes within "value" (selectedInstitutions.[])
      //TODO: This is fubar
      let institutionObject = institution instanceof Ember.Object ? institution :  Ember.Object.create(institution);
      selectedInstitutionCopy.addObject(institutionObject);
      this.set('item.selectedInstitution', selectedInstitutionCopy);
      // Add institution to select2 component
      /*
      var id = '#s2id_' + this.get('item.id');
      var institutionsElement = Ember.$(id).select2('data');
      institutionsElement.addObject(institutionObject);
      Ember.$(id).select2('data', institutionsElement);
      */
    },
  }
});
