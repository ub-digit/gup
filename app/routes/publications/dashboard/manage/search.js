import Ember from 'ember';

export default Ember.Route.extend({
	afterModel: function(transition) {
		this.controllerFor('application').set('currentList', transition.targetName);
	},
	setupController: function(controller, model) {
		controller.set("manageController.isNavVisible", true);
	}
});
