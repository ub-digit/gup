import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  i18n: Ember.inject.service(),
  returnTo: null,

  queryParams: {
    other_version: { refreshModel: true }
  },
  
  model: function(params, transition) {
    var model = this.modelFor('publications.show');
    if(params.other_version) {
      return Ember.RSVP.hash({
        model: model,
        other: this.store.find('publication', model.id, {version_id: params.other_version}),
      });
    } else {
      return { model: model };
    }
  },
  setupController: function(controller, model) {
    controller.set('model', model.model);
    controller.set('otherPublication', model.other || {});
    if(model.other) {
      controller.set('other_version', parseInt(controller.get('other_version')));
      controller.set('otherPublicationSelected', true);
    } else {
      controller.set('otherPublicationSelected', false);
    }
    var target = controller.get('applicationController.currentList');
    // Check to see if previous post list was bibliographic review list and set view mode to extended if so. Otherwise reset view mode to compact.
    if (target === 'publications.dashboard.biblreview') {
      controller.set('isExtendedViewMode', true);
    } else {
      controller.set('isExtendedViewMode', false);
    }
  }
});
