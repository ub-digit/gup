import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),

  titleToken: function() {
    return this.get("i18n").t('admin.people.title');
  },
  queryParams: {
    qp: { refreshModel: true}
  },

  model: function(params) {
    return this.store.find("person_record", {search_term: params.qp, ignore_affiliation: true});
  },
  setupController: function(controller, model) {
    this._super(...arguments);
    sessionStorage.setItem('admin.people.lastQuery', controller.get('qp'));
    if(sessionStorage.getItem('admin.people.changeWarning') === 'true') {
      controller.set('personChangeWarningAfterEditActive', true);
      sessionStorage.removeItem('admin.people.changeWarning');
    } else {
      controller.set('personChangeWarningAfterEditActive', false);
    }

    // Fill search field with query from url so that it is not lost on reload
    controller.set('query', controller.get('qp'));
  },
  actions: {
    deletePerson: function(model) {
      var that = this;
      if(confirm(this.get('i18n').t('admin.people.person.confirmDeletePerson'))) {
        this.store.destroy('person', model.id).then(function() {
          that.refresh(model.id);
        });
      }
    }
  }
});
