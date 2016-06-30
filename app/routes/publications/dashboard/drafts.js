import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    queryParams:{
        page:{refreshModel: true}
     },

	beforeModel: function() {
		Ember.$("body").addClass("loading");

	},
	model: function(params){
        if(!params.page) {
          params.page = 1;
        }     
        return  this.store.find("draft", params);

	},
	afterModel: function(model, transition) {
		Ember.$("body").removeClass("loading");
		this.controllerFor('application').set('currentList', transition.targetName);
	},

	actions: {
		refreshModel: function() {
			this.refresh();
		}

	}
});
