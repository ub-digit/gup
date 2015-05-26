import Ember from 'ember';


export default Ember.Controller.extend({
  needs: ['publications'],
  selectedPublicationType: null,
  selectedContentType: null,
  showRegisterNewAuthor: false,
  formIsVisible: false,
  authorArr: [],


  formIsVisible: function() {  
      if (this.get("selectedPublicationType") === null) {
          return false;
      }
      else {
        return true;
      }
  }.property('selectedPublicationType', 'selectedContentType'),

  updateModelWithCorrectPublicationType: function() {
    this.set("model.publication_type_id", this.get("selectedContentType"));
  }.observes('selectedPublicationType', 'selectedContentType'),

  authorArrChanged: function() {
    console.log("DEBUG state of author array", this.authorArr);
  //  this.formatAuthorsForServer();
  }.observes('authorArr.@each.first_name'),


  formatAuthorsForServer: function() {
    var arr = [];
    var departments = [];
    this.get("authorArr").forEach(function(author) {
      if (author.selectedAuthor) {
        if (author.selectedInstitution) {
          if (author.selectedInstitution.length > 0) {
              author.selectedInstitution.forEach(function(department) {
              departments.push({id: department.id, name: department.text});
            });
          }
          else {
            departments.push({id: '666', name: 'Extern institution'});
          }
        }
        else {
          departments.push({id: '666', name: 'Extern institution'});
        }
        arr.addObject({id: author.selectedAuthor.id, departments: departments});
        //empty array 
        departments = [];
      }
    });
    this.set("model.people", arr);
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

/*  formPartial: function() {
    if (this.get('model')) {
      this.set('model.publication_type_id', this.get('selectedContentType'));
      var contentType = this.get('publicationTypes').findBy('id', this.get('selectedContentType') || 0);    
    }
  }.observes('selectedPublicationType', 'selectedContentType'),*/


  getClassNameForSelectedPublicationTypeAndContentType: function() {
    if (this.get('selectedPublicationType') === '- Välj -') {
      return "no-selection";
    }
    else {
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
      this.get("authorArr").addObject(
        Ember.Object.create({
          id: this.generateUUID(),
          selectedAuthor: null, 
          selectedInstitution: null, 
          newAuthorForm: Ember.Object.create({firstName: '', lastName: '', year_of_birth: '', xaccount: '', orcid: ''})
        })
      );
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



    cancel: function() {     
        this.transitionTo('publications.manage.show', this.model);
    },


    toggleAddNewAuthor: function(id) {
      var obj = this.get("authorArr").findBy('id', id);
      if (obj.get("transformedToNewAuthor") === true) {
        obj.set("transformedToNewAuthor", false);
      }
      else {
        obj.set("transformedToNewAuthor", true);
      }
      
    },
  }
});
