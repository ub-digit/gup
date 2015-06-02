import Ember from 'ember';


export default Ember.Controller.extend({
  needs: ['publications'],
  selectedPublicationType: null,
  mayBecomeSelectedPublicationType: null, 
  mayBecomeOldSelectedPublicationType: null, 
  selectedContentType: null,
  showRegisterNewAuthor: false,
  authorArr: [],


  getConfigMetaForField: function(fieldName) {
     var fullObject = this.get("publicationTypes").findBy('code', this.get("selectedPublicationType"));
     if (fullObject) {
        var logicForField = fullObject.fields.findBy('name','title');
        if (logicForField) {
          return logicForField;
        }
        else {
          return null;
        } 
      }
      else { // if no object was found 
        return null;
      }
  }.property('selectedPublicationType'),

  getPublicationTypeObject: function() {
    if ((this.get("selectedPublicationType") != "- Välj -") && (this.get("selectedPublicationType") !== null)) {
       var fullObjectPubtype = this.get("publicationTypes").findBy("code", this.get("selectedPublicationType"));
       return fullObjectPubtype;
    }
   
  }.property('selectedPublicationType'),

  updateModelWithCorrectPublicationType: function() {
    this.set("publication.publication_type", this.get("selectedPublicationType"));
  }.observes('selectedPublicationType'),



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
    this.set("publication.people", arr);
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

  isSelectedPublicationValid: function() {
    if ((this.get("selectedPublicationType") != "- Välj -") && (this.get("selectedPublicationType") !== null && this.get("selectedPublicationType") !== undefined)) {
      return true;
    }
    else {
      return false;
    }
  }.property('selectedPublicationType'),

  authorComponentIsVisible: function() {
      if (this.get("isSelectedPublicationValid")) {
        return true;
      }
      else {
        return false;
      }
  }.property('selectedPublicationType'),

  actionButtonsAreVisible: function() {
      if (this.get("isSelectedPublicationValid")) {
        return true;
      }
      else {
        return false;
      }
  }.property('selectedPublicationType'),

  contentTypesAreVisible: function() {
      if (this.get("isSelectedPublicationValid")) {
        return true;
      }
      else {
        return false;
      }
  }.property('selectedPublicationType'),


  selectPublicationTypeIsVisible: function() {
      if (!this.get("isSelectedPublicationValid")) {
        return true;
      }
      else {
        return false;
      }
  }.property('selectedPublicationType'),

  descriptionOfMayBecomeSelectedPublicationType: function() {
    var fullObj = this.get("publicationTypes").findBy("code", this.get("mayBecomeSelectedPublicationType"));
    if (fullObj) {
      return fullObj.label + " - en massa andra detajler här som t ex hur denna typen är tänkt att användas." // description later
    }
    else {
      return null;
    }
  }.property("mayBecomeSelectedPublicationType"),
  
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
    setAsSelectedPublicationType: function() {
      if (this.get("mayBecomeSelectedPublicationType")) {
        this.set("selectedPublicationType", this.get("mayBecomeSelectedPublicationType"));
      }
    },
    resetSelectedPublicationType: function() {
      this.set("mayBecomeOldSelectedPublicationType", this.get("selectedPublicationType"));
      this.set("selectedPublicationType", null);
    },

    moveUp: function(id) {
      // first find the item and its index
      var curPos = null;
      var temp = this.get("authorArr").find(function(item, index) {
        if (item.id === id) {
          curPos = index;
          return true;
        }
      });
      if (curPos > 0) {
        var temp2 = this.get("authorArr").objectAt(curPos-1);
        this.get("authorArr").removeAt(curPos);
        this.get("authorArr").insertAt(curPos, temp2);
        this.get("authorArr").removeAt(curPos-1);
        this.get("authorArr").insertAt(curPos-1, temp);
      }
    },
    moveDown: function(id) {
        // first find the item and its index
        var curPos = null;
        var temp = this.get("authorArr").find(function(item, index) {
          if (item.id === id) {
            curPos = index;
            return true;
          }
        });
        if (curPos < (this.get("authorArr").length-1)) {
          var temp2 = this.get("authorArr").objectAt(curPos+1);
          this.get("authorArr").removeAt(curPos);
          this.get("authorArr").insertAt(curPos, temp2);
          this.get("authorArr").removeAt(curPos+1);
          this.get("authorArr").insertAt(curPos+1, temp);
        }
    },
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
    cancelChangePublicationType: function() {
      this.set("selectedPublicationType", this.get("mayBecomeOldSelectedPublicationType"));
    },
    
    cancel: function() {     
        this.transitionTo('publications.manage.show', this.publication);
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
