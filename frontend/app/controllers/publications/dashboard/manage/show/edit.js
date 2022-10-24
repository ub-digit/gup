import Ember from 'ember';
import { validYear } from 'frontend/lib/validations';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  scroller: Ember.inject.service(),
  publications: Ember.inject.controller(),
  manageController: Ember.inject.controller('publications.dashboard.manage'),
  selectedPublicationType: null,
  mayBecomeSelectedPublicationType: null,
  mayBecomeOldSelectedPublicationType: null,
  authorArr: Ember.A([]),
  queryParams: ['selectPublicationVisible'],
  selectPublicationVisible: true,
  refValueBool: false,
  categoryObjectsList: Ember.A([]),
  hasInvalidSelectedDepartmentItems: false,
  isShowingInvalidSelectedDepartmentsConfirmation: false,

  createNewPublicationLink: function() {
    return Ember.Object.create({
      url: '',
    });
  },

  submitCallbacks: Ember.A([]), // Hack
  // Run callbacks and collect promises to resolve on submit
  submitCallbacksRun: function() {
    return Ember.RSVP.Promise.all(this.get('submitCallbacks').map(function(callback) {
      return callback();
    }));
  },

  selectedSeries: Ember.computed('publication.series', {
    get: function() {
      //TODO: ('publication.series').map()
      var pubSeries = this.get('publication.series');
      return this.get('series').filter(function(item) {
        if (!pubSeries) { return false; }
        return pubSeries.includes(parseInt(item.id));
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
        return pubProject.includes(parseInt(item.id));
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
          }, () => {
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
    this.get("institutions").forEach((item) => {
      item.children = null;
    });

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
  getPublicationTypeObject: Ember.computed('selectedPublicationType', 'publicationTypes', function() {
    let fullObjectPubtype = this.get('publicationTypes').findBy('code', this.get('selectedPublicationType'));
    return fullObjectPubtype;
  }),

  scrollTop: function() {
    window.scrollTo(0, 0);
  }.observes('errors', 'selectPublicationVisible'),


  updateModelWithCorrectPublicationType: function() {
    this.set('publication.publication_type_id', this.get('getPublicationTypeObject.id'));
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
    return !this.get('showRegisterNewAuthor');
  }.property('showRegisterNewAuthor'),

  authorComponentIsVisible: function() {
    return this.get('isSelectedPublicationValid');
  }.property('selectedPublicationType'),

  /* end author-block */

  isSelectedPublicationValid: function() {
    return !(this.get('selectedPublicationType') === '- Välj -' || Ember.isEmpty(this.get('selectedPublicationType')));
  }.property('selectedPublicationType'),

  actionButtonsAreVisible: function() {
    return this.get('isSelectedPublicationValid');
  }.property('selectedPublicationType'),

  selectPublicationTypeIsVisible: function() {
    if (!this.get('isSelectedPublicationValid')) {
      this.set('selectPublicationVisible', true);
      return true;
    }
    else {
      this.set('selectPublicationVisible', false);
      return false;
    }
  }.observes('selectedPublicationType'),

  refValueSelectionVisible: Ember.computed.equal('publicationTypeObject.ref_options', 'BOTH'),

  refInfoTextVisible: Ember.computed('selectedPublicationType', function() {
      return this.get('selectedPublicationType') === 'artistic-work_original-creative-work';
  }),

  changeRefValue: Ember.observer('refValueBool', function() {
      if (this.get('refValueBool')) {
        this.set('publication.ref_value', 'ISREF');
      }
      else {
        this.set('publication.ref_value', 'NOTREF');
      }
  }),

  refValueChanged: Ember.observer('publication.ref_value', function() {
    this.set('refValueBool', this.get('publication.ref_value') === 'ISREF');
  }),

  publicationTypeObject: Ember.computed('selectedPublicationType', function(){
    return this.get('publicationTypes').findBy('code', this.get('selectedPublicationType'));
  }),

  descriptionOfMayBecomeSelectedPublicationType: function() {
    var fullObj = this.get('publicationTypes').findBy('code', this.get('mayBecomeSelectedPublicationType'));
    if (fullObj) {
      return fullObj.description;
    }
    else {
      return null;
    }
  }.property('mayBecomeSelectedPublicationType'),

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
    sanitizePublicationLink: function(link) {
      link.set('url', link.get('url').trim());
      if (Ember.isPresent(link.get('url')) && !/^\w+:\/\//.test(link.get('url'))) {
        link.set('url', 'http://' + link.get('url'));
      }
    },
    setPublicationTypeFilter: function(filter){
      this.set('publicationTypeFilter', filter);
    },
    setAsSelectedPublicationType: function() {
      if (this.get('mayBecomeSelectedPublicationType')) {
        this.set('selectedPublicationType', this.get('mayBecomeSelectedPublicationType'));
      }
    },
    setPublicationType: function(publicationType) {
      this.set('selectedPublicationType', publicationType);
      var ref_options = this.get('publicationTypeObject.ref_options');
      if (ref_options !== 'BOTH') {
        this.set('publication.ref_value', ref_options);
      } else {
        this.set('publication.ref_value', 'NOTREF');
      }
    },
    resetSelectedPublicationType: function() {
      this.set('mayBecomeOldSelectedPublicationType', this.get('selectedPublicationType'));
      this.set('mayBecomeSelectedPublicationType', this.get('selectedPublicationType'));
      this.set('selectedPublicationType', null);
    },

    /* author-block */
    toggleAddNewAuthor: function(id) {
      var obj = this.get('authorArr').findBy('id', id);
      if (obj.get('transformedToNewAuthor') === true) {
        obj.set('transformedToNewAuthor', false);
      }
      else {
        obj.set('transformedToNewAuthor', true);
      }
    },
    /* end author-block */

    cancelChangePublicationType: function() {
      this.set('selectedPublicationType', this.get('mayBecomeOldSelectedPublicationType'));
    },

    // Dummy catcher for field-component without a surrounding field-group
    countContent: function() {
      return false;
    },

    invalidSelectedDepartmentItemsChanged: function(items) {
      this.set('hasInvalidSelectedDepartmentItems', Ember.isPresent(items));
    },

    saveDraft: function() {
      this.send('savePublication', true);
    },
    savePublish: function() {
      this.send('savePublication', false);
    },

    maybeSave: function(saveAction) {
      if(this.get('hasInvalidSelectedDepartmentItems')) {
        this.set('saveAction', saveAction);
        this.set('isShowingInvalidSelectedDepartmentsConfirmation', true);
      }
      else {
        this.set('isShowingInvalidSelectedDepartmentsConfirmation', false);
        saveAction();
      }
    },
    maybeSaveAction: function() {
      this.get('saveAction')();
      // TODO: Not needed right now, refactor confirmation-modal not to set this internally since bad ember practice
      // and uncomment this line?
      //this.set('isShowingInvalidSelectedDepartmentsConfirmation', false);
    }
  }
});
