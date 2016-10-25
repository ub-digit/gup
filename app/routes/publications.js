import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function(params) {
    return Ember.RSVP.hash({
      publicationTypes: this.store.find('publication_type'),
      faculties: this.store.find('faculty'),
    });
  },

  setupController: function(controller, model) {
    this._super(...arguments);
    controller.set('publicationTypes', model.publicationTypes);
    controller.set('faculties', model.faculties);
  },

});
