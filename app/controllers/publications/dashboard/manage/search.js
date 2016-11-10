import Ember from 'ember';

export default Ember.Controller.extend({
    manageController: Ember.inject.controller("publications.dashboard.manage"),
  	page: 1,
    search_term: '',
  	queryParams: ['page', 'search_term'],

    actions: {
        findPublications: function() {
            this.set("search_term", this.get("term"));
            this.set("page", 1);
        } 
    }  	
});
