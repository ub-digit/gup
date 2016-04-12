import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    qp: { refreshModel: true}
  },
  model: function(params) {
    return this.store.find("person", {search_term: params.qp, ignore_affiliation: true});
  },
  setupController: function(controller, model) {
    // Extract xaccount from array of identifiers into a specific xaccount property
    // to simplify output in result lists
    model.forEach(function(item) {
      item.identifiers.forEach(function(identifier) {
        if(identifier.source_name === 'xkonto') {
          Ember.set(item, 'xaccount', identifier.value);
        }
      });
    });
    controller.set('model', model);
    
    // Fill search field with query from url so that it is not lost on reload
    controller.set('query', controller.get('qp'));
  }
});
