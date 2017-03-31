import Ember from 'ember';

export default Ember.Controller.extend({
	i18n: Ember.inject.service(),
  session: Ember.inject.service('session'),
  	page: 1,
  	queryParams: ['page', 'sort_by', 'publication_id', 'person_id', 'department_id', 'faculty_id', 'serie_id', 'project_id', 'publication_type', 'ref_value', 'start_year', 'end_year'],
  	sortSelectValues: Ember.A([]), 
  	sort_by: 'pubyear',
  	publication_id: null, 
    person_id: "",
    department_id: null,
    faculty_id: null,
    serie_id: null,
    project_id: null,
    publication_type: null,
    ref_value: null,
    start_year: null,
    end_year: null,
    
    selectedDepartments: [],
    selectedAuthors: [],
    isRef: false, // translate to ISREF/NOTREF in queryparam ref_value
    base_start_year: 1942,
    base_end_year: null, // is set in setupController
    

    resetPaging: Ember.observer("selectedAuthors", "selectedDepartments", "isRef", "start_year", "end_year", function() {
      this.set("page", 1);
    }),

    resultIsVisible: Ember.computed("person_id", "department_id", "ref_value", "start_year", "end_year", function() {
      if (this.get("person_id") || this.get("department_id") || this.get("ref_value") || this.get("start_year") || this.get("end_year")) {
        return true;
      }
      return false;
    }),

    getLink: Ember.computed("session", function() {
      if (this.get("session.isAuthenticated")) {
        return "publications.dashboard.manage.show";
      }
      return "publication";
    }),

    selectedDepartmentsChanged: Ember.observer('selectedDepartments', function() {
      this.formatForQueryStr('department_id', this.get('selectedDepartments'));
    }),


    selectedAuthorsChanged: Ember.observer('selectedAuthors', function() {
      this.formatForQueryStr('person_id', this.get('selectedAuthors'));
    }),

    isRefValueChanged: Ember.observer('ref_value', function() {
      if (this.get("ref_value") !== 'ISREF'){
        this.set("isRef", false);
      }
      else {
        this.set("isRef", true);
      }
    }),

    isRefChanged: Ember.observer('isRef', function() {
      if (this.get("isRef")) {
        this.set("ref_value", "ISREF");
      }
      else {
        this.set("ref_value", null);
      }
    }),

    rangeYear: Ember.computed('base_start_year', 'base_end_year', function() {
      let arr = [];
      for (var i = this.get("base_start_year"); i < this.get("base_end_year"); i++) {
          arr[i] = i.toString(); 
      }
      return arr;
    }),



    formatForQueryStr(name, selectedValues) {
      // takes array and formats to semicolon separated string. Removes trailing ; in naiv way maybe change
      let that = this;
      this.set(name, "");
      selectedValues.forEach(function(item) {
        if (that.get(name).indexOf(item.id + ";") === -1) {
          that.set(name, that.get(name) + item.id + ";");
        }        
      });
      // remove trailing ; in string as its gets added in loop above
      if (this.get(name)) {
        if (this.get(name).endsWith(';')) {
          this.set(name, this.get(name).slice(0,-1));
        }
      }
    },

    actions: {
      searchAuthor(term) {
        return this.store.find('person_record', {search_term: term});
      },
      searchDepartment(term) {
        return this.store.find('department', {search_term: term});
      }


    }
});
