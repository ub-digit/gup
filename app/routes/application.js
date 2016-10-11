import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin'; //Remove?


export default Ember.Route.extend(ApplicationRouteMixin, {
  i18n: Ember.inject.service(),
  session: Ember.inject.service('session'),

  beforeModel: function() {
    var lang = "sv"; /// change to default
    if (sessionStorage.getItem('lang')) {
      lang = sessionStorage.getItem('lang');
    }
    this.set('i18n.locale', lang);
    sessionStorage.setItem('lang', lang);
    this._super();
  },


  actions: {


    loading(transition, originRoute) {
      let controller = this.controllerFor('application');
      controller.set('currentlyLoading', true);
      transition.promise.finally(function() {
          controller.set('currentlyLoading', false);
      });

      return true;
    },


    invalidateSession() {
      this.get('session').invalidate();
    },

		refreshUserdata: function() {
		  var that = this;
		  this.store.find('userdata', this.get('session.data.authenticated.username')).then(function(data) {
			  that.controllerFor("application").set("userdata", data);
		  });
	  },

    sessionAuthenticationFailed: function(error) {
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

      var successHandler = function(model) {
          that.transitionTo('publications.dashboard.manage.show', publication_id);
      };
      var errorHandler = function(model) {
          that.controller.set('publication_id_error', that.get('i18n').t('mainMenu.idMissing') + ': ' + publication_id);
      };
      var generalHandler = function(model) {
        if (model.error) {
          errorHandler(model);
        }
        else {
          successHandler(model);
        }
      };

      if (publication_id) {
        that.store.find('publication', publication_id).then(generalHandler);
      }
    }
  }
});
