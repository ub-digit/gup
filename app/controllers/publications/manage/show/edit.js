import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['publications'],
  selectedPublicationType: null,
  selectedContentType: null,
  selectedAuthor: null,
  selectedInstitution: null,
  showRegisterNewAuthor: false,
  authorArr: [],

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

    return this.get('controllers.publications.model').map(function(pubtype) {
      if (found[pubtype.publication_type_code]) {
        return null;
      }
      else {
        found[pubtype.publication_type_code] = true;
        return pubtype;
      }
    }).compact();

  }.property('controllers.publications.model'),

  formPartial: function() {
  	this.set('model.publication_type_id', this.get('selectedContentType'));
    var contentType = this.get('controllers.publications.model').findBy('id', this.get('selectedContentType') || 0);    
    return 'publications/publicationtypes/' + contentType.form_template;
  }.property('selectedPublicationType', 'selectedContentType'),
  
  contentTypes: function() {
    return this.get('controllers.publications.model').filterBy('publication_type_code', this.get('selectedPublicationType'));
  }.property('selectedPublicationType', 'controllers.publications.model'),
 
  setDefaultContentType: function() {
    var contentType = this.get('controllers.publications.model').findBy('publication_type_code', this.get('selectedPublicationType'));    
    this.set('selectedContentType', contentType.id);
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
      }
      var fromStore = this.store.find("person", {search_term: query.term});
      fromStore.then(deferred.resolve, deferred.reject);
  
    }

  }
});
