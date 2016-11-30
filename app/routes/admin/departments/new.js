import Ember from 'ember';

export default Ember.Route.extend({

  model: function(){
    return {};
  },

  actions: {
    saveDepartment: function(model) {
      var controller = this.controller;
	    var successHandler = () => {
        this.transitionTo('admin.departments.index');
	    };
	    var errorHandler = (reason) => {
	      this.send('setMsgHeader', 'error', reason.error.msg);
				controller.set('errors', reason.error.errors);
	      Ember.run.later(function() {
	        Ember.$('[data-toggle="popover"]').popover({
	          placement: 'top',
	          html: true
	        });
	      });
	    };
	    this.store.save('department', model).then(successHandler, errorHandler);
    }
  }
});
