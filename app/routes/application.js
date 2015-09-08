import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  /*queryParams: {
    lang: {
      refreshModel: true
    }
  },*/
  beforeModel: function() {
    this._super();
    var defaultLang = this.controllerFor("application").getDefaultLocale();
    if (this.get("session.authenticated")) {    
      // redirect handled in index route
    }
    else {
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
    },

    showPublication: function(publication_id) {
      var that = this;
      this.controller.set('publication_id', null);
      this.controller.set('publication_id_error', null);

      if (publication_id) {
        that.store.find('publication', publication_id).then(function() {
          that.transitionTo('publications.show', publication_id);
        },
        function(){
          that.controller.set('publication_id_error', that.t('mainMenu.idMissing') + ': ' + publication_id);
        });
      }
    }
  }
});
