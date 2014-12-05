import Ember from 'ember';

export default Ember.Route.extend({
  needs: ['publications'],
  model: function(){
    return this.modelFor('publications.manage.show');
  },
  setupController: function(controller, model) {
    controller.set('errors', null);
    controller.set('hasErrors', null);
    controller.set('showErrorHeader', false);
    controller.set('model', model);
  },

  actions: {
    cancel: function(model) {
      var that = this;
      this.store.find('publication',model.pubid).then(function(model) {
        that.transitionTo('publications.manage.show', model);
      });
    },
    save: function(model,is_draft) {
      console.log(model);
      var that = this;
      var successHandler = function() {
        that.store.find('draft').then(function(drafts) {
          that.controllerFor('publications.manage').set('model',drafts);
          // här skall man kunna välja att gå till den första posten om listan är icke-tom
          that.transitionTo('publications.manage');
        });        
      };
      var errorHandler = function(reason) {
        console.log(reason);
        that.controller.set('hasErrors', true);
        that.controller.set('showErrorHeader', true);
        that.controller.set('errors', reason.responseJSON.errors);
        return false;
      };
      if (is_draft === 'draft'){
        model.is_draft = true;
      }else{
        model.is_draft = false;
      }
      
      this.store.save('publication',model).then(successHandler, errorHandler);
    },
    hideErrorHeader: function() {
      this.controller.set('showErrorHeader', false);
    }
  }
});

