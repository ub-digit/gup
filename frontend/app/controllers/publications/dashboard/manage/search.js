import Ember from 'ember';

export default Ember.Controller.extend({
    manageController: Ember.inject.controller("publications.dashboard.manage"),
  	page: 1,
    search_term: '',
    term: '',
  	queryParams: ['page', 'search_term'],

    updateTempTerm: Ember.observer('search_term', function() {
        this.set("term", this.get("search_term"));
    }),
    
    displayNoResult: Ember.computed('search_term', function() {
        if (this.get("search_term").length > 0) {
            return true;
        }
        return false;
    }),

    isSearchInputEmpty: Ember.computed('term', function() {
        if (this.get("term").length > 0) {
            return "is-filled";
        }
        return "is-empty";
    }),
 
    resetData: function() {
        this.set("search_term",'');
        this.set("page", 1);
    },

    actions: {
        findPublications: function() {
            this.set("search_term", this.get("term"));
            this.set("page", 1);
        },

        resetForm: function() {
            this.set("term", '');
            this.set("search_term", this.get("term"));
        } 
    }  	
});
