import Ember from 'ember';

export default Ember.Route.extend({
  needs: ['publications'],
  model: function(){
    return this.modelFor('publications.manage.show');
  },
  setupController: function(controller, model) {
    controller.set('errors', null);
    controller.set('hasErrors', null);
    controller.set('showMesgHeader', false);
    controller.set('model', model);
    console.log(model);
    var publicationType = this.controllerFor('publications').get('model').findBy('id', model.publication_type_id);
    controller.set('selectedPublicationType', publicationType.publication_type_code);
    controller.set('selectedContentType', model.publication_type_id);

  },

  actions: {
    cancel: function(model) {
      var that = this;
      this.store.find('publication',model.pubid).then(function(model) {
        that.transitionTo('publications.manage.show', model);
      });
    },
    save: function(model,is_draft) {
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
      if (is_draft === 'draft'){
        model.is_draft = true;
      }else{
        model.is_draft = false;
      }

      this.store.save('publication',model).then(successHandler, errorHandler);
    },
    hideMesgHeader: function() {
      this.controller.set('showMesgHeader', false);
      this.controller.set('hasErrors', false);
      this.controller.set('errors',''); 
    }
  }
});

