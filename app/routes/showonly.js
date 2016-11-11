import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return Ember.RSVP.hash({
      publicationTypes: this.store.find('publication_type'),
      publication: this.store.find('publication', params.id)
    });
  },

  setupController: function(controller, model) {
    controller.set("publication", model.publication);
    controller.set("publicationTypes", model.publicationTypes);
  }
});
