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
    ref_value: null,
    start_year: null,
    end_year: null
});
