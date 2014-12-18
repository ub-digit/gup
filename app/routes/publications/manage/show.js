import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params){
    return this.store.find('publication',params.id);
  },
  actions: {
    cancel: function() {
      this.transitionTo('publications.manage');
    },
    delete: function(model) {
      var that = this;
      var successHandler = function() {
        var rsvp =  Ember.RSVP.hash({drafts: that.store.find("draft"), publications: that.store.find("publication")});
        rsvp.then(function(model) {
          that.controllerFor('publications.manage').set('drafts',model.drafts);
          that.controllerFor('publications.manage').set('publications',model.publications);
          // här skall man kunna välja att gå till den första posten om listan är icke-tom
          that.transitionTo('publications.manage');
        });        
      };
      var errorHandler = function(reason) {
        console.log(reason);
        that.controller.set('hasErrors', true);
        that.controller.set('showMesgHeader', true);
        that.controller.set('errors', reason.responseJSON.errors);
        return false;
      };
      this.store.destroy('publication',model.pubid).then(successHandler, errorHandler);
    }
  }
});

