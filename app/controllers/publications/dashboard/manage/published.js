import Ember from 'ember';

export default Ember.Controller.extend({
	manageController: Ember.inject.controller("publications.dashboard.manage"),
  	page: 1,
  	queryParams: ['page'],


});



