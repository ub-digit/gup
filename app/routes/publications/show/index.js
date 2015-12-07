import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import ENV from 'gup/config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  i18n: Ember.inject.service(),
  returnTo: null,
  model: function(params, transition) {
    return this.modelFor('publications.show');
  },
  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('isExtendedViewMode', false);
  }
});
