import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  i18n: Ember.inject.service(),
  beforeModel: function() {
    var lang = "sv"; /// change to default
    if (sessionStorage.getItem('lang')) {
      lang = sessionStorage.getItem('lang');
    }
    this.set('i18n.locale', lang);
    sessionStorage.setItem('lang', lang);

    this._super();
    if (this.get("session.authenticated")) {
			this.fetchUserdata();
    }
    else {
      this.transitionTo('login');
    }
  },

	fetchUserdata: function() {
		var controller = this.controllerFor('application');
		var session = this.get('session.content');
		this.store.find('userdata', session.username).then(function(data) {
			controller.set('userdata', data);
		});
	},
	fetchUserdataLoop: function(interval) {
		if(!interval) { interval = 60000; }
		this.fetchUserdata();
		Ember.run.later(this, function() {
			this.fetchUserdataLoop();
		}, interval);
	},

  actions: {
		refreshUserdata: function() {
			this.fetchUserdata();
		},
    sessionAuthenticationSucceeded: function() {
      //Ember.run.later(Ember.$('body').removeClass("loading"));
      this.transitionTo("publications.dashboard.start");
      Ember.run.later(function() {Ember.$('body').removeClass("loading");});
			this.fetchUserdataLoop(60000);
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
          that.controller.set('publication_id_error', that.get('i18n').t('mainMenu.idMissing') + ': ' + publication_id);
        });
      }
    },
    toggleViewMode: function(){
      var controller = this.controllerFor('application');
      if (controller.get('viewMode') === 'basic') {
        controller.set('viewMode', 'advanced');
      } else {
        controller.set('viewMode', 'basic');
      }
    }
  }
});
