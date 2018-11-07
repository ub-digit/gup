import Ember from 'ember';

export default Ember.Route.extend({

  model: function(){
    return {};
  },

  actions: {
    saveDepartment: function(model) {
      var controller = this.controller;
	    let successHandler = () => {
        this.transitionTo('admin.departments.index');
	    };
	    let errorHandler = (reason) => {
	      this.send('setMsgHeader', 'error', reason.error.msg);
				controller.set('errors', reason.error.errors);
	      Ember.run.later(function() {
	        Ember.$('[data-toggle="popover"]').popover({
	          placement: 'top',
	          html: true
	        });
	      });
	    };
      let generalHandler = (model) => {
              console.log(model);

        if (model.error) {
          errorHandler(model);
        }
        else {
          successHandler(model);
        }
      };
	    this.store.save('department', model).then(generalHandler);
    }
  }
});
