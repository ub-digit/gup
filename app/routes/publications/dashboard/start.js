import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
		Ember.$("body").addClass("loading");
	},
	afterModel: function(model, transition) {
      Ember.$("body").removeClass("loading");
      this.controllerFor('application').set('currentList', transition.targetName);
      this.controllerFor('application').set('publication_id_error', null);
      this.controllerFor('publications.dashboard.start').set('publication_id', null);
	}
});
