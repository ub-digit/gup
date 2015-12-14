import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  i18n: Ember.inject.service(),
  returnTo: null,
  model: function(params, transition) {
    return this.modelFor('publications.show');
  },
  setupController: function(controller, model) {
    controller.set('model', model);
    var target = controller.get('applicationController.currentList');
    // Check to see if previous post list was bibliographic review list and set view mode to extended if so. Otherwise reset view mode to compact.
    if (target === 'publications.dashboard.biblreview') {
      controller.set('isExtendedViewMode', true);
    } else {
      controller.set('isExtendedViewMode', false);
    }
  }
});
