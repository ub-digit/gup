import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  queryParams: {
    qd: { refreshModel: true}
  },
  model: function(params) {
    return this.store.find("department", {search_term: params.qd});
  },
  setupController: function(controller, model) {
    controller.set('model', model);
    sessionStorage.setItem('admin.departments.lastQuery', controller.get('qd'));
    controller.set('query', controller.get('qd'));
  },
  actions: {
    setEndYear: function(model, newEndYear) {
      var that = this;
      if(newEndYear) {
        Ember.set(model, 'end_year', parseInt(newEndYear));
      } else {
        Ember.set(model, 'end_year', null);
      }
      this.store.save('department', model).then(function(data) {
        Ember.$('#setEndYearModal').modal('hide');
      }, function() {
        Ember.set(model, 'end_year', null);
        that.controller.set('modalError', that.get('i18n').t('messages.saveDepartmentError'));
      });
    }
  }
});
