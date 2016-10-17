import Ember from 'ember';
import ResetScroll from 'gup/mixins/resetscroll';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin,ResetScroll, {
    i18n: Ember.inject.service(),
    titleToken: function() {
     // return this.get("i18n").t('publications.dashboard.manage.show.title');
    },

  beforeModel: function() {
    // TODO: loading substate instead (below should not work?)
  },

  model: function(params) {
    return this.store.find('publication', params.id);
  },


  setupController: function(controller, model) {
    controller.set("model", model);
    controller.set("manageController.isNavVisible", false);
  },

  afterModel: function(/*model, transition */) {
  },

  actions: {
    refreshModel: function(modelId) {
      this.refresh(modelId);
    },
    error: function(reason) {
      this.send('setMsgHeader', 'error', this.get('i18n').t('publications.dashboard.manage.show.publicationNotFound'));
//      this.transitionTo('publications.dashboard.manage.start');

    }
  }
});
