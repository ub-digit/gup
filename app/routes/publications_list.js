import Ember from 'ember';


export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('publications_list.title_page');
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
    return  this.store.find('published_publication', params);
  },
  setupController: function(controller, model) {
    controller.set('model', model);
    if (controller.get('sortSelectValues').length === 0) {
      controller.get('sortSelectValues').pushObjects([
          { value: 'pubyear', label: this.get("i18n").t('publications_list.sortByYearLabel') },
          { value: 'title', label: this.get("i18n").t('publications_list.sortByTitleLabel') }
      ]);
    }
  }
});
