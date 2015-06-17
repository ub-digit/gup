import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
		Ember.$("body").addClass("loading");
	},
	afterModel: function(model, transition) {
		Ember.$("body").removeClass("loading");
    this.controllerFor('application').set('currentList', transition.targetName);
	},
  model: function() {
    return this.store.find("publication", {is_actor: true, for_review: true});
  }  
});
