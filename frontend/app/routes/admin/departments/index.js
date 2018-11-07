import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('admin.departments.title');
  },
  queryParams: {
    qd: { refreshModel: true}
  },
  model: function(params) {
    return this.store.find("department", {search_term: params.qd});
  },
  setupController: function(controller) {
    this._super(...arguments);
    sessionStorage.setItem('admin.departments.lastQuery', controller.get('qd'));
    controller.set('query', controller.get('qd'));
  },
  actions: {
    setEndYear: function(model, newEndYear) {
      if(newEndYear) {
        Ember.set(model, 'end_year', parseInt(newEndYear));
      } else {
        Ember.set(model, 'end_year', null);
      }
      this.store.save('department', model).then(() => {
        Ember.$('#setEndYearModal').modal('hide');
      }, () => {
        Ember.set(model, 'end_year', null);
        this.controller.set('modalError', this.get('i18n').t('admin.departments.index.saveError'));
      });
    }
  }
});
