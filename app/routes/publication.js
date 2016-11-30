import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return Ember.RSVP.hash({
      publicationTypes: this.store.find('publication_type'),
      publication: this.store.find('publication', params.id)
    });
  },

  setupController: function(controller, models) {
    controller.set("publication", models.publication);
    controller.set("publicationTypes", models.publicationTypes);
    
    var publicationType = models.publicationTypes.findBy('id', models.publication.publication_type_id);
    if (!models.publication.error && publicationType) {
      controller.set('selectedPublicationType', publicationType.code);
    }
    else {
      controller.set('publication', null);
      controller.set('selectedPublicationType', null);
    }
  }
});
