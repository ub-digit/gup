import Ember from 'ember';

export default Ember.Controller.extend({
  	queryParams: ['page', 'sort_by'],
  	sortSelectValues: Ember.A([]), 
  	page: 1,
  	sort_by: 'pubyear'
});



