import Ember from 'ember';

export default Ember.Route.extend({
    i18n: Ember.inject.service(),
    titleToken: function() {
      return this.get("i18n").t('publications.dashboard.manage.search.title');
    },

	afterModel: function(transition) {
		this.controllerFor('application').set('currentList', transition.targetName);
	},
	setupController: function(controller, model) {
		controller.set("manageController.isNavVisible", true);
	}
});
