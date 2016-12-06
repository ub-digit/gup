import Ember from 'ember';

export default Ember.Controller.extend({
	i18n: Ember.inject.service(),
  	page: 1,
  	queryParams: ['page', 'sort_by'],
  	sortSelectValues: Ember.A([]), 
  	sort_by: 'pubyear'
});



