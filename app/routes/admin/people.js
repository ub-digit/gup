import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  queryParams: {
    qp: { refreshModel: true}
  },
  model: function(params) {
    return this.store.find("person", {search_term: params.qp, ignore_affiliation: true});
  },
  setupController: function(controller, model) {
    // Extract xaccount and orcid from array of identifiers into a
    // specific xaccount/orcid property to simplify output in result lists
    model.forEach(function(item) {
      item.identifiers.forEach(function(identifier) {
        if(identifier.source_name === 'xkonto') {
          Ember.set(item, 'xaccount', identifier.value);
        }
        if(identifier.source_name === 'orcid') {
          Ember.set(item, 'orcid', identifier.value);
        }
      });
    });
    controller.set('model', model);
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
      if(confirm(this.get('i18n').t('messages.confirmDeletePerson'))) {
        this.store.destroy('person', model.id).then(function() {
          that.refresh(model.id);
        });
      }
    }
  }
});
