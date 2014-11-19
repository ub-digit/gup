import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return {};
  },

  setupController: function(controller, model) {
    controller.set('errors', null);
    controller.set('hasErrors', null);
    controller.set('model', model);
  },

  actions: {
    submit: function(model) {
      var that = this;
      var successHandler = function(model) {
        that.transitionTo('publications.show', model.id);
      };
      var errorHandler = function(reason) {
        console.log(reason);
        that.controller.set('hasErrors', true);
        that.controller.set('errors', reason.responseJSON.errors);
        return false;
      };
      this.store.save('publication',model).then(successHandler, errorHandler);
    }
  }
});

