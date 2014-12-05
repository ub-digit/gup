import Ember from 'ember';

export default Ember.Route.extend({
  actions:{
    create: function() {
      var that = this;
      var successHandler = function(model) {
        that.store.find('draft').then(function(drafts) {
          that.controllerFor('publications.manage').set('model',drafts);
          // här väljer man att gå till den första posten om listan är icke-tom
          that.transitionTo('publications.manage.show.edit', model.pubid);
        });        
      };
      var errorHandler = function(reason) {
        console.log(reason);
        that.controller.set('hasErrors', true);
        that.controller.set('showErrorHeader', true);
        that.controller.set('errors', reason.responseJSON.errors);
        return false;
      };
      this.store.save('publication', {}, {"datasource": 'none'}).then(successHandler, errorHandler);
    },

    import: function(sourceData){
      console.log(sourceData);
      var that = this;
      var successHandler = function(model) {
        that.store.find('draft').then(function(drafts) {
          that.controllerFor('publications.manage').set('model',drafts);
          // här ska man kunna välja att gå till den första posten om listan är icke-tom
          that.transitionTo('publications.manage.show.edit', model.pubid);
        });        
      };
      var errorHandler = function(reason) {
        console.log(reason);
        that.controller.set('hasErrors', true);
        that.controller.set('showErrorHeader', true);
        that.controller.set('errors', reason.responseJSON.errors);
        return false;
      };
      this.store.save('publication', {}, {"datasource": sourceData.selectedSource, "sourceid": sourceData.sourceId}).then(successHandler, errorHandler);    
    }
  }
});

