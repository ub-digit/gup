import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {

  beforeModel: function() {
    this._super();
    //	this.transitionTo('login');
    if (this.get("session.authenticated")) {
      //console.log("session", this.get("session"));
      //	this.transitionTo('publications.manage');
    }
    else {
      this.transitionTo('login');
    }
  },

       actions: {
         sessionAuthenticationSucceeded: function() {
           //Ember.run.later(Ember.$('body').removeClass("loading"));
           this.transitionTo("publications.dashboard.drafts");
           Ember.run.later(function() {Ember.$('body').removeClass("loading")});
           //	return this._super();	
         },
         sessionAuthenticationFailed: function(error) {
           Ember.$('body').removeClass("loading");
           this.controllerFor('login').set('error', error.msg);
         },
         hideMesgHeader: function() {
           this.controller.set('showMesgHeader', false);
           this.controller.set('hasErrors', false);
           this.controller.set('errors',''); 
           this.controller.set('mesg',''); 
         },
         setMesgHeader: function(hasErrors, mesg, errors){
           this.controller.set('showMesgHeader', true);
           this.controller.set('hasErrors', hasErrors);
           this.controller.set('mesg', mesg);
           this.controller.set('errors', errors);
         }
       }
});
