import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

	beforeModel: function() {
		Ember.$("body").addClass("loading");

	},
	model: function(){
		return  this.store.find("draft");
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
