import Ember from 'ember';


export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('publications_list.title_page');
  },
  queryParams:{
    page: { refreshModel: true },
    sort_by: { refreshModel: true },

    publication_id: { refreshModel: true },
    person_id: { refreshModel: true },
    department_id: { refreshModel: true },
    faculty_id: { refreshModel: true },
    serie_id: { refreshModel: true },
    publication_type: { refreshModel: true },
    ref_value: { refreshModel: true },
    start_year: { refreshModel: true },
    end_year: { refreshModel: true }
  },
  afterModel: function(model, transition) {
    this.controllerFor('application').set('currentList', transition.targetName);
  },
  model: function(params){
    if(!params.page) {
      params.page = 1;
    }
    return  this.store.find('public_publication_list', params);
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
