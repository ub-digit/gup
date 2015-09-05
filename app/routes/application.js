import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import ENV from '../config/environment';

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: Ember.inject.service('simple-auth-session:main'),
  /*queryParams: {
    lang: {
      refreshModel: true
    }
  },*/
	casService: function() {
    var baseUrl = window.location.origin;
    var routeUrl = this.router.generate('application');
    return baseUrl + '/' + routeUrl;
  },
  beforeModel: function(transition) {
		console.log("application-beforeModel", transition);
    var ticket = transition.queryParams.ticket;
		console.log("application-beforeModel.ticket", ticket);
    if(ticket) {
      this.get('session').authenticate('authenticator:custom', {
        cas_ticket: ticket,
        cas_service: this.casService()
      });
    }

    this._super(transition);
    var defaultLang = this.controllerFor("application").getDefaultLocale();
    if (this.get("session.authenticated")) {    
      // redirect handled in index route
    }
    else if(!ticket) {
      this.transitionTo('login', {queryParams: {lang: defaultLang}});
    }
  },

  model: function(params) {
    var lang = "sv"; /// change to default
    if (params.lang) {
      lang = params.lang;
    }
    this.controllerFor("application").set('lang', lang);
    this.controllerFor("application").setLocale();
  },

  setupController: function(controller) {
    if(ENV.APP.casBaseURL) {
      var casLoginUrl = ENV.APP.casBaseURL+'/login?'+Ember.$.param({service: this.casService()});
      controller.set('casLoginUrl', casLoginUrl);
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
