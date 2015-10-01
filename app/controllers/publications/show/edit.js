import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['publications'],
  selectedPublicationType: null,
  mayBecomeSelectedPublicationType: null,
  mayBecomeOldSelectedPublicationType: null,
  selectedContentType: null,
  authorArr: Ember.A([]),
  categoryObjectsList: Ember.A([]),

	selectedSeries: Ember.computed('publication.series', function(key, value, oldValue) {
		var pubSeries = this.get('publication.series');
		if(arguments.length === 1) {
			return this.get('series').filter(function(item) {
				if(!pubSeries) { return false; }
				return pubSeries.contains(parseInt(item.id));
			});
		} else {
			this.set('publication.series', value.map(function(item) {
				return parseInt(item.id);
			}));
			return value;
		}
	}),

	selectedProjects: Ember.computed('publication.project', function(key, value, oldValue) {
		var pubProject = this.get('publication.project');
		if(arguments.length === 1) {
			return this.get('projects').filter(function(item) {
				if(!pubProject) { return false; }
				return pubProject.contains(parseInt(item.id));
			});
		} else {
			this.set('publication.project', value.map(function(item) {
				return parseInt(item.id);
			}));
			return value;
		}
	}),

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

  //Update department list depending on given publication year
  updateDepartmentList: Ember.observer('publication.pubyear', function(){
    var that = this;
    // Check if value is a valid year
    var year = this.get('publication.pubyear');
    if (isNaN(year) || year > 2100 || year < 1000){
      return;
    }
    this.store.find('department', {year: year}).then(
      function(response) {
        that.set('institutions', response);
      },
      function(reason){}
      )
  }),

  getPublicationTypeObject: Ember.computed('selectedPublicationType', 'publicationTypes', function() {
    var fullObjectPubtype = this.get("publicationTypes").findBy("code", this.get("selectedPublicationType"));
    return fullObjectPubtype;
  }),

  updateModelWithCorrectPublicationType: function() {
    this.set("publication.publication_type", this.get("selectedPublicationType"));
  }.observes('selectedPublicationType'),


  /* author-block */ 

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
  },



  authorComponentDisabled: function() {
    if (this.get('showRegisterNewAuthor')) {
      return  false;
    }
    else {
      return true;

    }
  }.property('showRegisterNewAuthor'),

  authorComponentIsVisible: function() {
      if (this.get("isSelectedPublicationValid")) {
        return true;
      }
      else {
        return false;
      }
  }.property('selectedPublicationType'),

  /* end author-block */ 


  isSelectedPublicationValid: function() {
    if ((this.get("selectedPublicationType") != "- Välj -") && (this.get("selectedPublicationType") !== null && this.get("selectedPublicationType") !== undefined)) {
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
          this.set("publication.content_type", currentlySelectedPublicationType.content_types[0].value);
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
    setPublicationType: function(publicationType) {
      this.set("selectedPublicationType", publicationType);
    },
    resetSelectedPublicationType: function() {
      this.set("mayBecomeOldSelectedPublicationType", this.get("selectedPublicationType"));
      this.set("mayBecomeSelectedPublicationType", this.get("selectedPublicationType"));
      this.set("selectedPublicationType", null);
    },

    /* author-block */ 

    toggleAddNewAuthor: function(id) {
      var obj = this.get("authorArr").findBy('id', id);
      if (obj.get("transformedToNewAuthor") === true) {
        obj.set("transformedToNewAuthor", false);
      }
      else {
        obj.set("transformedToNewAuthor", true);
      }
    },
    /* end author-block */ 

    cancelChangePublicationType: function() {
      this.set("selectedPublicationType", this.get("mayBecomeOldSelectedPublicationType"));
    },
  }
});
