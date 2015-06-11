import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  queryParams: {
    lang: {
      refreshModel: true
    }
  },
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

  model: function(params) {
    this.controllerFor("application").set('lang', params.lang)
  },

  setupController: function(controller) {
    this.controllerFor("application").setLocale();
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
    hideMsgHeader: function() {
      this.controller.set('showMsgHeader', false);
      this.controller.set('hasErrors', false);
      this.controller.set('errors','');
      this.controller.set('mesg','');
    },
    setMsgHeader: function(type, msg){
      this.controller.set('showMsgHeader', true);
      this.controller.set('msgType', type);
      this.controller.set('msg', msg);

      var that = this;

      Ember.run.later(function() {
        that.send('hideMsgHeader');
      }, 4000);
    }
  }
});
