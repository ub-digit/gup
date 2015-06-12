import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
		Ember.$("body").addClass("loading");
	},
	afterModel: function() {
		Ember.$("body").removeClass("loading");
	},
  model: function() {
    return this.store.find("publication", {is_actor: true, for_review: true});
  },
  setupController: function(controller, model) {

    //console.log('model:', model);
    controller.set('model', model);

  }
});
