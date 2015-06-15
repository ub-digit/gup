import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['publications'],
  selectedPublicationType: null,
  mayBecomeSelectedPublicationType: null,
  mayBecomeOldSelectedPublicationType: null,
  selectedContentType: null,
  showRegisterNewAuthor: false,
  authorArr: [],
  categoryObjectsList: Ember.A([]),

  updateCategoryObjects: Ember.observer('publication.category_hsv_local.@each', function(){
    var that = this;
    // Create list if it doesn\t exist
    if (that.get('categoryObjectsList') === undefined) {
      that.set('categoryObjectsList', Ember.A([]));
    }

    // Fetch objects if they aren\t loaded
    if (this.get('publication.category_hsv_local')) {
      this.get('publication.category_hsv_local').forEach(function(item){
        var categoryObject = that.get('categoryObjectsList').findBy('svepid', item);
        if (categoryObject === null || categoryObject === undefined) {
          that.store.find('category', item).then(
            function(response){
              that.categoryObjectsList.pushObject(response);
          },
            function(error){
          })
        }
      });
    }

    // Remove objects which are no longer part of category list
    that.get('categoryObjectsList').forEach(function(item){
      if (that.get('publication.category_hsv_local').indexOf(item.svepid) === -1) {
        that.get('categoryObjectsList').removeObject(item);
      }
    })
  }),


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
              departments.push({id: department.id, name: department.name});
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
    this.set("publication.authors", arr);
    console.log('catarray', this.get('publication.category_hsv_local'));
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
      return fullObj.description;
    }
    else {
      return null;
    }
  }.property("mayBecomeSelectedPublicationType"),

  contentTypes: function() {
     var currentlySelectedPublicationType = this.get('publicationTypes').findBy('code', this.get('selectedPublicationType'));
     if (currentlySelectedPublicationType) {
       return currentlySelectedPublicationType.content_types;
     }
     else {
       return null;
     }
  }.property('selectedPublicationType'),

  selectedPublicationTypeHasNoContentType: function() {
    var currentlySelectedPublicationType = this.get('publicationTypes').findBy('code', this.get('selectedPublicationType'));
    if (currentlySelectedPublicationType) {
      if (currentlySelectedPublicationType.content_types) {
        if(currentlySelectedPublicationType.content_types.length >0) {
          return false;
        }
        else {
          return true;
        }
      }
      else {
        return true;
      }
    }
  }.property("selectedPublicationType"),

  selectedPublicationTypeHasNoOnlyOneContentType: function() {
    var currentlySelectedPublicationType = this.get('publicationTypes').findBy('code', this.get('selectedPublicationType'));
    if (currentlySelectedPublicationType) {
      if (currentlySelectedPublicationType.content_types) {
        if(currentlySelectedPublicationType.content_types.length === 1) {
          this.set("publication.content_type", currentlySelectedPublicationType.content_types[0]);
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
  }.property('selectedPublicationType'),


  setDefaultContentType: function() {
    var contentType = this.get('publicationTypes').findBy('code', this.get('selectedPublicationType'));
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
      this.set("mayBecomeSelectedPublicationType", this.get("selectedPublicationType"));
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
