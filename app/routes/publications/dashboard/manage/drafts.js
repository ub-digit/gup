import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
    queryParams:{
        page:{refreshModel: true}
     },

	beforeModel: function() {

	},
	model: function(params){
        if(!params.page) {
          params.page = 1;
        }     
        return  this.store.find("draft", params);

	},
	afterModel: function(model, transition) {
		this.controllerFor('application').set('currentList', transition.targetName);
	},

	setupController: function(controller, model) {
		controller.set("model", model);
		controller.set("manageController.isNavVisible", true);
	},

	actions: {
		refreshModel: function() {
			this.refresh();
		}

	}
});
