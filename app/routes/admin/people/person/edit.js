import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('person', params.id);
  },
  setupController: function(controller, model) {
    // Extract xaccount and orcid from array of identifiers into a
    // specific xaccount/orcid property to simplify output in result lists
    model.identifiers.forEach(function(identifier) {
      if(identifier.source_name === 'xkonto') {
        Ember.set(model, 'xaccount', identifier.value);
      }
      if(identifier.source_name === 'orcid') {
        Ember.set(model, 'orcid', identifier.value);
      }
    });
		controller.set('errors', {});
    controller.set('lastQuery', sessionStorage.getItem('admin.people.lastQuery'));
    controller.set('model', model);
  },
  actions: {
    savePerson: function(model) {
      var that = this;
      var controller = this.controller;
	    var successHandler = function(data) {
        sessionStorage.setItem('admin.people.changeWarning', true);
        that.transitionTo('admin.people', {queryParams: {qp: sessionStorage.getItem('admin.people.lastQuery')}});
	    };
	    var errorHandler = function(reason) {
	      that.send('setMsgHeader', 'error', reason.error.msg);
				controller.set('errors', reason.error.errors);
	      Ember.run.later(function() {
	        Ember.$('[data-toggle="popover"]').popover({
	          placement: 'top',
	          html: true
	        });
	      });
	    };

      var person_data = {
        id: model.id,
        first_name: model.first_name,
        last_name: model.last_name,
        year_of_birth: model.year_of_birth,
	      xaccount: model.xaccount,
        orcid: model.orcid
      };
      
	    this.store.save('person', person_data).then(successHandler, errorHandler);
    }
  }
});
