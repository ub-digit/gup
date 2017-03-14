import Ember from 'ember';

export default Ember.Controller.extend({
	i18n: Ember.inject.service(),
  	page: 1,
  	queryParams: ['page', 'sort_by', 'publication_id', 'person_id', 'department_id', 'faculty_id', 'serie_id', 'project_id', 'publication_type', 'ref_value', 'start_year', 'end_year'],
  	sortSelectValues: Ember.A([]), 
  	sort_by: 'pubyear',
  	publication_id: null, 
    person_id: null,
    department_id: null,
    faculty_id: null,
    serie_id: null,
    project_id: null,
    publication_type: null,
    ref_value: 'NOTREF',
    start_year: null,
    end_year: null,
    
    
    isRef: false,
    base_start_year: 1942,
    base_end_year: new Date().getFullYear() + 10,

    isRefValueChanged: Ember.observer('ref_value', function() {
      if (this.get("ref_value") === 'NOTREF'){
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
        this.set("ref_value", "NOTREF");
      }
    }),

    rangeYear: Ember.computed('base_start_year', 'base_end_year', function() {
      let arr = [];
      for (var i = this.get("base_start_year"); i < this.get("base_end_year"); i++) {
          arr[i] = i.toString();
      }
      return arr;
    })
});
