import Ember from 'ember';

export default Ember.Controller.extend({
	i18n: Ember.inject.service(),
	manageController: Ember.inject.controller("publications.dashboard.manage"),
  	page: 1,
  	queryParams: ['page', 'sort_by'],
  	sortSelectValues: Ember.A([]), 
  	sort_by: 'pubyear'


});



