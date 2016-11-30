import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('publications.dashboard.reports.title');
  },
  model: function() {
    return Ember.RSVP.hash({
      departments: this.store.find('department')
    });
  },
  setupController: function(controller, models) {
    this._super(...arguments);
    controller.set('departments', models.departments);
    controller.set('filter', {});
    controller.set('columns', {});
    controller.set('model', null);
    var pubTypes = controller.get('publicationsController.publicationTypes').map(function(item) {
      return {
        name: item.name,
        code: item.code,
        checked: false
      };
    });
    controller.set('publicationTypes', pubTypes);
  },
  actions: {
    createReport: function(filter, columns) {
      this.store.save('report', {filter: filter, columns: columns}).then((model) => {
        this.controller.set('reportRowsColumns', columns);
        this.controller.set('model', model);
        window.scrollTo(0,0);
      });
    },
    resetFilter: function() {
      this.controller.set('filter', {});
      this.controller.get('publicationTypes').setEach('checked', false);
      this.controller.set('person', null);
      window.scrollTo(0,0);
    },
    didTransition: function() {
      this.controller.set('filter', {});
      this.controller.get('publicationTypes').setEach('checked', false);
      this.controller.set('person', null);
    }
  }
});
