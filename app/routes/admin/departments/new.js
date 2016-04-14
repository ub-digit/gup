import Ember from 'ember';

export default Ember.Route.extend({

  model: function(){
    return {};
  },

  actions: {
    saveDepartment: function(model) {
      var that = this;
      var controller = this.controller;
	    var successHandler = function(data) {
        that.transitionTo('admin.departments.index');
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

      
	    this.store.save('department', model).then(successHandler, errorHandler);
    }
  }
});
