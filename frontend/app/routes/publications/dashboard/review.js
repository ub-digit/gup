import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('publications.dashboard.review.title');
  },
  afterModel: function(model, transition) {
    this.controllerFor('application').set('currentList', transition.targetName);
  },
  model: function() {
    return this.store.find("review_publication");
  },
  actions: {
    editItem: function(item, params) {
      //			console.log("transitionTo publication.show.edit", item, params);
      this.transitionTo('publications.dashboard.manage.show.edit', item.id, {queryParams: params});
    }
  }
});
