import Ember from 'ember';


export default Ember.Controller.extend({
  needs: ['publications'],
  selectedPublicationType: null,
  selectedContentType: null,
  showRegisterNewAuthor: false,
  authorArr: [],

  authorArrChanged: function() {
    console.log("DEBUG state of author array", this.authorArr);
    this.formatAuthorsForServer();
  }.observes('authorArr.@each.first_name'),


  formatAuthorsForServer: function() {
    var arr = [];
    this.get("authorArr").forEach(function(item) {
      if (item.selectedAuthor) {
        arr.addObject({id: item.selectedAuthor.id, departments: item.selectedInstitution});
      }
    });
  },

  generateUUID: function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  },

  isThisTheOnlyAuthorRow: function() {
    if (this.get("authorArr").length === 1) {
      return true;
    }
    else {
      return false;
    }
  }.property('authorArr.@each'),


  authorComponentDisabled: function() {
    if (this.get('showRegisterNewAuthor')) {
      return  false;
    }
    else {
      return true;

    }
  }.property('showRegisterNewAuthor'),


  publicationTypeCodes: function(){
    
    var found = {};

    return this.get('publicationTypes').map(function(pubtype) {
      if (found[pubtype.publication_type_code]) {
        return null;
      }
      else {
        found[pubtype.publication_type_code] = true;
        return pubtype;
      }
    }).compact();

  }.property('publicationTypes'),

  formPartial: function() {
    if (this.get('model')) {
      this.set('model.publication_type_id', this.get('selectedContentType'));
      var contentType = this.get('publicationTypes').findBy('id', this.get('selectedContentType') || 0);    
    }
  }.observes('selectedPublicationType', 'selectedContentType'),


  getClassNameForSelectedPublicationTypeAndContentType: function() {
    if (this.get('selectedPublicationType') === '- Välj -') {
      return "no-selection";
    }
    else {
      console.log(this.get('publicationTypes').findBy('id', this.get('selectedContentType') || 0));
      return this.get('publicationTypes').findBy('id', this.get('selectedContentType') || 0).form_template;
   //   var names = this.get("selectedPublicationType") + '-' + this.get("selectedContentType");
   //   return names.replace(/[!\"#$%&'\(\)\' '\\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
    }
   }.property('selectedPublicationType', 'selectedContentType'),
  
  contentTypes: function() {
    return this.get('publicationTypes').filterBy('publication_type_code', this.get('selectedPublicationType'));
  }.property('selectedPublicationType', 'publicationTypes'),
 
  setDefaultContentType: function() {
    var contentType = this.get('publicationTypes').findBy('publication_type_code', this.get('selectedPublicationType'));    
    if (contentType) {
      this.set('selectedContentType', contentType.id);
    }
  }.observes('selectedPublicationType'),

  actions: {
    addNewAuthorRow: function() {
      this.get("authorArr").addObject(Ember.Object.create({id: this.generateUUID(), selectedAuthor: null, selectedInstitution: null}));
    },
    removeAuthorRow: function(id) {
      var list = this.get("authorArr").toArray();
      var that = this;
      list.forEach(function(item) {
        if (item.id === id) {
          that.get("authorArr").removeObject(item);
        }
      });
    },
    closeRegisterNewAuthor: function() {
      this.set("showRegisterNewAuthor", false);
    },

    queryAuthors: function(query, deferred) {
      deferred.reject = function(reason) {
        console.log(reason);
      };
      var fromStore = this.store.find("person", {search_term: query.term});
      fromStore.then(deferred.resolve, deferred.reject);
  
    },

    cancel: function() {     
        this.transitionTo('publications.manage.show', this.model);
    },

  }
});
