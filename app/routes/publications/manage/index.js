import Ember from 'ember';

export default Ember.Route.extend({
  actions:{
    edit: function(sourceData) {
      var that = this;
      var successHandler = function() {
      sourceData.pubid='';
      };
      var errorHandler = function(reason) {
        console.log(reason);
        that.controller.set('hasErrors', true);
        that.controller.set('showMesgHeader', true);
        that.controller.set('errors', reason.responseJSON.errors);
        return false;
      };
      //console.log(sourceData.pubid);
      if (!sourceData.pubid){
        that.controller.set('hasErrors', true);
        that.controller.set('showMesgHeader', true);
        that.controller.set('errors', 'Redigering misslyckades: inget pubid angivet');
      }else{
        this.transitionTo('publications.manage.show.edit', sourceData.pubid).then(successHandler, errorHandler);
      }
    },
    create: function() {
      var that = this;
      var successHandler = function(model) {
        var rsvp =  Ember.RSVP.hash({drafts: that.store.find("draft"), publications: that.store.find("publication")});
        rsvp.then(function(lists) {
          that.controllerFor('publications.manage').set('drafts',lists.drafts);
          that.controllerFor('publications.manage').set('publications',lists.publications);
          // här väljer man att gå till den första posten om listan är icke-tom
          that.transitionTo('publications.manage.show.edit', model.pubid);
        });        
      };
      var errorHandler = function(reason) {
        console.log(reason);
        that.controller.set('hasErrors', true);
        that.controller.set('showMesgHeader', true);
        that.controller.set('errors', reason.responseJSON.errors);
        return false;
      };
      this.store.save('publication', {}, {"datasource": 'none'}).then(successHandler, errorHandler);
    },

    import: function(sourceData){
      console.log(sourceData);
      var that = this;
      var successHandler = function(model) {
        sourceData.sourceId='';
        var rsvp =  Ember.RSVP.hash({drafts: that.store.find("draft"), publications: that.store.find("publication")});
        rsvp.then(function(lists) {
          that.controllerFor('publications.manage').set('drafts',lists.drafts);
          that.controllerFor('publications.manage').set('publications',lists.publications);
          // här ska man kunna välja att gå till den första posten om listan är icke-tom
          that.transitionTo('publications.manage.show.edit', model.pubid);
        });        
      };
      var errorHandler = function(reason) {
        console.log(reason);
        that.controller.set('hasErrors', true);
        that.controller.set('showMesgHeader', true);
        that.controller.set('errors', reason.responseJSON.errors);
        return false;
      };
      if (!sourceData.sourceId){
        that.controller.set('hasErrors', true);
        that.controller.set('showMesgHeader', true);
        that.controller.set('errors', 'Import misslyckades: inget id angivet');
      }else{
        this.store.save('publication', {}, {"datasource": sourceData.selectedSource, "sourceid": sourceData.sourceId}).then(successHandler, errorHandler);    
      }
    },
    hideMesgHeader: function() {
      this.controller.set('showMesgHeader', false);
      this.controller.set('hasErrors', false);
      this.controller.set('errors',''); 
    }
  }
});

