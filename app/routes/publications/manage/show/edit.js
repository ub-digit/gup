import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params){
    return this.modelFor('publications.manage.show')
  },
  actions: {
    cancel: function(model) {
      if(confirm('HÖDDÖ')) {
        var that = this;
        this.store.find('publication',model.id).then(function(model) {;
          that.transitionTo('publications.manage.show', model);
        });
      };
    }
  }
});

