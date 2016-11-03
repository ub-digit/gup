import Ember from 'ember';
import { validYear } from 'gup/lib/validations';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'), 
  publications: Ember.inject.controller(),
  manageController: Ember.inject.controller("publications.dashboard.manage"),
  selectedPublicationType: null,
  mayBecomeSelectedPublicationType: null,
  mayBecomeOldSelectedPublicationType: null,
  authorArr: Ember.A([]),
  categoryObjectsList: Ember.A([]),
  submitCallbacks: Ember.A([]), // Hack
  // Run callbacks and collect promises to resolve on submit
  submitCallbacksRun: function() {
    return Promise.all(this.get('submitCallbacks').map(function(callback) {
      return callback();
    }));
  },
  selectedSeries: Ember.computed('publication.series', {
    get: function() {
      var pubSeries = this.get('publication.series');
      return this.get('series').filter(function(item) {
        if (!pubSeries) { return false; }
        return pubSeries.contains(parseInt(item.id));
      });
    },
    set: function(key, value) {
      this.set('publication.series', value.map(function(item) {
        return parseInt(item.id);
      }));
      return value;
    }
  }),

  selectedProjects: Ember.computed('publication.project', {
    get: function() {
      var pubProject = this.get('publication.project');
      return this.get('projects').filter(function(item) {
        if (!pubProject) { return false; }
        return pubProject.contains(parseInt(item.id));
      });
    },
    set: function(key, value){
      this.set('publication.project', value.map(function(item) {
        return parseInt(item.id);
      }));
      return value;
    }
  }),

  updateCategoryObjects: Ember.observer('publication.category_hsv_local.[]', function(){
    // Create list if it doesn\t exist
    if (this.get('categoryObjectsList') === undefined) {
      this.set('categoryObjectsList', Ember.A([]));
    }

    // Fetch objects if they aren't loaded
    if (this.get('publication.category_hsv_local')) {
      this.get('publication.category_hsv_local').forEach((item) => {
        let categoryObject = this.get('categoryObjectsList').findBy('id', item);
        if (Ember.isEmpty(categoryObject)) {
          this.store.find('category', item).then((response) => {
            this.categoryObjectsList.pushObject(response);
          }, (error) => {
            //TODO: handle? propagate?
          });
        }
      });
    }

    // Remove objects which are no longer part of category list
    this.get('categoryObjectsList').forEach((item) => {
      if (this.get('publication.category_hsv_local').indexOf(item.id) === -1) {
        this.get('categoryObjectsList').removeObject(item);
      }
    });
  }),

  publicationYearDepartments: Ember.computed('publication.pubyear', 'institutions', function() {
    var publicationYear = parseInt(this.get('publication.pubyear'));
    // If no valid year, return all departments
    // (this may not be a good idea)
    if (!validYear(publicationYear.toString())) {
      return this.get('institutions');
    }
    return this.get('institutions').filter(function(department) {
      // TODO: Warning if wrong type?
      // TODO: This is perhaps not the place to check types,
      // assume correct types?
      return (
        Ember.isBlank(department.start_year) ||
        Ember.typeOf(department.start_year) !== 'number' ||
        department.start_year <= publicationYear
      ) && (
        Ember.isBlank(department.end_year) ||
        Ember.typeOf(department.end_year) !== 'number' ||
        department.end_year >= publicationYear
      );
    });
  }),
  //TODO: what is this in this context!?
  getPublicationTypeObject: Ember.computed('selectedPublicationType', 'publicationTypes', function() {
    let fullObjectPubtype = this.get('publicationTypes').findBy('code', this.get('selectedPublicationType'));
    return fullObjectPubtype;
  }),

  scrollTop: function() {
    window.scroll(0,0);
  }.observes('selectPublicationTypeIsVisible'),
  


  updateModelWithCorrectPublicationType: function() {
    this.set("publication.publication_type_id", this.get("getPublicationTypeObject.id"));
  }.observes('selectedPublicationType'),

  /* author-block */
  formatAuthorsForServer: function() {
    var authors = this.get('authorArr').map((author) => {
      if (!Ember.isEmpty(author.selectedAuthor)) {
        let departments = [];
        departments = author.get('selectedInstitution').map(function(department) {
          return {id: department.id, name: department.name};
        });
        if (Ember.isEmpty(departments)) {
          departments.addObject({id: '666', name: 'Extern institution'});
        }
        return {id: author.selectedAuthor.id, departments: departments};
      }
      return null;
    }).compact();
    this.set('publication.authors', authors);
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
    if ((this.get("selectedPublicationType") !== "- Välj -") && (this.get("selectedPublicationType") !== null && this.get("selectedPublicationType") !== undefined)) {
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

  selectPublicationTypeIsVisible: function() {
    if (!this.get("isSelectedPublicationValid")) {
      return true;
    }
    else {
      return false;
    }
  }.property('selectedPublicationType'),

  refValueSelectionVisible: Ember.computed.equal('publicationTypeObject.ref_options', 'BOTH'),

  publicationTypeObject: Ember.computed('selectedPublicationType', function(){
    return this.get("publicationTypes").findBy("code", this.get("selectedPublicationType"));
  }),

  descriptionOfMayBecomeSelectedPublicationType: function() {
    var fullObj = this.get("publicationTypes").findBy("code", this.get("mayBecomeSelectedPublicationType"));
    if (fullObj) {
      return fullObj.description;
    }
    else {
      return null;
    }
  }.property("mayBecomeSelectedPublicationType"),

  publicationTypeFilter: 'all',

  showPublicationTypeGroupBooks: Ember.computed('publicationTypeFilter', function(){
    return (this.get('publicationTypeFilter') === 'books' || this.get('publicationTypeFilter') === 'all');
  }),
  showPublicationTypeGroupArticles: Ember.computed('publicationTypeFilter', function(){
    return (this.get('publicationTypeFilter') === 'articles' || this.get('publicationTypeFilter') === 'all');
  }),
  showPublicationTypeGroupConference: Ember.computed('publicationTypeFilter', function(){
    return (this.get('publicationTypeFilter') === 'conference' || this.get('publicationTypeFilter') === 'all');
  }),
  showPublicationTypeGroupArtworks: Ember.computed('publicationTypeFilter', function(){
    return (this.get('publicationTypeFilter') === 'artworks' || this.get('publicationTypeFilter') === 'all');
  }),
  showPublicationTypeGroupOther: Ember.computed('publicationTypeFilter', function(){
    return (this.get('publicationTypeFilter') === 'other' || this.get('publicationTypeFilter') === 'all');
  }),
  isSelectedAll: Ember.computed.equal('publicationTypeFilter', 'all'),
  isSelectedBooks: Ember.computed.equal('publicationTypeFilter', 'books'),
  isSelectedArticles: Ember.computed.equal('publicationTypeFilter', 'articles'),
  isSelectedConference: Ember.computed.equal('publicationTypeFilter', 'conference'),
  isSelectedArtworks: Ember.computed.equal('publicationTypeFilter', 'artworks'),
  isSelectedOther: Ember.computed.equal('publicationTypeFilter', 'other'),

  actions: {
    setPublicationTypeFilter: function(filter){
      this.set('publicationTypeFilter', filter);
    },
    setAsSelectedPublicationType: function() {
      if (this.get("mayBecomeSelectedPublicationType")) {
        this.set("selectedPublicationType", this.get("mayBecomeSelectedPublicationType"));
      }
    },
    setPublicationType: function(publicationType) {
      this.set("selectedPublicationType", publicationType);
      var ref_options = this.get('publicationTypeObject.ref_options');
      if (ref_options !== 'BOTH') {
        this.set('publication.ref_value', ref_options);
      } else {
        this.set('publication.ref_value');
      }
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
