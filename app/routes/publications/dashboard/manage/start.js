import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
		Ember.$("body").addClass("loading");
	},
  model: function() {
    return Ember.RSVP.hash({
      news_message: this.store.find('message', 'NEWS'),
      alert_message: this.store.find('message', 'ALERT')
    });
  },

  setupController: function(controller, model) {
    this._super(...arguments);
    this.controller.set('messages', model);
  },
	afterModel: function(model, transition) {
      Ember.$("body").removeClass("loading");
      this.controllerFor('application').set('currentList', transition.targetName);
      this.controllerFor('application').set('publication_id_error', null);
      this.controllerFor('publications.dashboard.manage.start').set('publication_id', null);
	}
});
