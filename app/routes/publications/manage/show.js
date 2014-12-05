import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params){
    return this.store.find('publication',params.id);
  },
  actions: {
    cancel: function(model) {
      if(confirm('OK, alltså')) {
        var that = this;
        this.store.find('publication',model.id).then(function(model) {;
          that.transitionTo('publications.manage', model);
        });
      };
    }
  }
});
