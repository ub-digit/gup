import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('publications.dashboard.manage.published.title');
  },
  queryParams:{
    page: { refreshModel: true },
    sort_by: { refreshModel: true }
  },
  afterModel: function(model, transition) {
    this.controllerFor('application').set('currentList', transition.targetName);
  },
  model: function(params){
    if(!params.page) {
      params.page = 1;
    }
    params.actor = 'logged_in_user';
    return  this.store.find('published_publication', params);
  },
  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('manageController.isNavVisible', true);
    if (controller.get('sortSelectValues').length === 0) {
      controller.get('sortSelectValues').pushObjects([
          { value: 'pubyear', label: this.get("i18n").t('publications.dashboard.manage.published.sortByYearLabel') },
          { value: 'title', label: this.get("i18n").t('publications.dashboard.manage.published.sortByTitleLabel') }
      ]);
    }
  }
});
