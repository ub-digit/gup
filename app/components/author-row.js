import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  errors: null,
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

  isFirst: Ember.computed('index', function() {
  if (this.get("index") === 0) {
    return "is-first";
  }
  return;
  }),

  isLast: Ember.computed('index', 'totalNumberOfItems', function() {
    if ((this.get("index")+1) === this.get('totalNumberOfItems')) {
      return 'is-last';
    }
    return;
  }),


  init: function() {
    this._super(...arguments);
    // Helper function for persisting new author items, returns promise
    this.set('createAuthor', (item) => {
      return new Ember.RSVP.Promise((resolve, reject) => {
        this.store.save('person', {
          'first_name': item.newAuthorForm.get('firstName'),
          'last_name': item.newAuthorForm.get('lastName'),
          'year_of_birth': item.newAuthorForm.get('year_of_birth'),
          'xaccount': item.newAuthorForm.get('xaccount'),
          'orcid': item.newAuthorForm.get('orcid'),
          'skip_update_search_engine': item.newAuthorForm.get('skip_update_search_engine'),
        }).then((model) => {
          item.set('selectedAuthor', model);
          item.set('transformedToNewAuthor', false);
          resolve(model); //Passing item, model or nothing here the right thing to do?
        }, (reason) => {
          reject(reason);
        });
      });
    });

    //TODO: Forgotten how to Ember, is this correct or should be property on object sent to extend??
    this.set('invalidSelectedDepartments', Ember.A([]));

    this.get('submitCallbacks').addObject(() => {
      if(this.get('isUnsaved')) {
        //TODO: user should be promted here!!
        // You have created a new Author, but not saved: "Save", "Discard", "Cancel"?
        return new Ember.RSVP.Promise((resolve, reject) => {
          let item = this.get('item');
          item.newAuthorForm.set('skip_update_search_engine', true);
          this.get('createAuthor')(item).then(resolve, reject);
        });
      }
      return Ember.RSVP.Promise.resolve();
    });
  },
  // Helper
  // Could be generalized, with dynamic prop and made global helper
  getDepartmentIds: function(departments) {
    return departments.reduce(function(result, department) {
      result[department.id] = department.id; //TODO: or null?
      return result;
    }, []);
  },

  departmentIds: Ember.computed('institutions.[]', function() {
    //TODO: or this.get(?
    return this.getDepartmentIds(this.get('institutions'));
  }),

  departmentsChanged: Ember.observer('institutions.[]', function() {
    // First check if there are any department values to possibly restore
    if(Ember.isPresent(this.get('invalidSelectedDepartments'))) {
      // Restore all departments no longer invalid
      let invalid_selected_departments = this.get('invalidSelectedDepartments').filter((department) => {
        let restored_department = this.get('institutions').findBy('id', department.id);
        if(restored_department) {
          this.get('item.selectedInstitution').pushObject(restored_department);
          return false;
        }
        return true;
      });
      if(invalid_selected_departments.length < this.get('invalidSelectedDepartments').length) {
        this.set('invalidSelectedDepartments', invalid_selected_departments);
      }
    }

    // Are any of the selected institutions no longer within the selectable institutions
    let department_ids = this.get('departmentIds');
    let removed_departments = [];
    let valid_selected_departments = this.get('item.selectedInstitution').filter((department) => {
      if(department_ids[department.id] === undefined) {
        removed_departments.push(department);
        return false;
      }
      return true;
    });
    this.set('item.selectedInstitution', valid_selected_departments);

    removed_departments.forEach((department) => {
      let active_years = "";
      if(department.start_year || department.end_year) {
        active_years =
          " (" + (department.start_year || '?') + " - " + (department.end_year || "")  + ")";
      }
      // Create peudo department objects since we loose reference to "real" department object
      // if removed for selectable department we can later retrieve the department by id if appears again
      this.get('invalidSelectedDepartments').pushObject({id: department.id, info: department.name + active_years});
    });
  }),

  validDepartmentSuggestions: Ember.computed('item.selectedAuthor', 'departmentIds', function() {
    let author_departments = this.get('item.selectedAuthor.departments');
    if (Ember.isArray(author_departments)) {
      // Create array keyed by institution id for faster lookup
      let department_ids = this.get('departmentIds');
      return author_departments.filter((department) => {
        // Filter out departments not present in selectable institutions
        return department_ids[department.id] !== undefined;
      }).map((department) => {
        return Ember.Object.create({
          'name': department.name,
          'department': department
        });
      });
    }
    return Ember.A([]);
  }),

  selectedDepartmentIds: Ember.computed('item.selectedInstitution.[]', function() {
    return this.getDepartmentIds(this.get('item.selectedInstitution'));
  }),

  nonSelectedValidDepartmentSuggestions: Ember.computed('validDepartmentSuggestions', 'selectedDepartmentIds', function() {
    let selected_department_ids = this.get('selectedDepartmentIds');
    if (Ember.isPresent(selected_department_ids)) {
      return this.get('validDepartmentSuggestions').filter((suggestion) => {
        return selected_department_ids[suggestion.get('department').id] === undefined;
      });
    }
    return this.get('validDepartmentSuggestions');
  }),

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
    authorInstitutionsChanged: function(institutions) {
      this.set('item.selectedInstitution', institutions);
    },
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
            //TODO: Remove this
            if(
                !doc['departments_end_year'] ||
                !doc['departments_end_year'][index] ||
                !doc['departments_start_year'] ||
                !doc['departments_start_year'][index] ||
                !doc['departments_name_' + locale] ||
                !doc['departments_name_' + locale][index]
              ) {
              console.dir(doc);
              throw "Invalid department format for author";
            }
            let start_year = doc['departments_start_year'][index];
            let end_year = doc['departments_end_year'][index];
            return {
              id: department_id,
              name: doc['departments_name_' + locale][index],
              'start_year': start_year !== -1 ? start_year : null,
              'end_year': end_year !== -1 ? end_year : null,
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
          //TODO: This is perhaps a little bit of a micro-opmtimization overkill
          // but instead of extracting departments greedily here
          // (there can be quite a lot of authors)
          // get departments lazily through getter function
          Object.defineProperty(item, 'departments', { get: () => { return zipDepartments(item, this.get('i18n.locale')); } });
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
