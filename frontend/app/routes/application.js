import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
//import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend (ApplicationRouteMixin,{
  i18n: Ember.inject.service(),
  session: Ember.inject.service('session'),

  title: function(tokens) {
    return  tokens.join(' - ') + ' - ' + this.get('i18n').t('application.title');
  },
  beforeModel: function(params) {
    let lang = 'sv'; /// change to default

    if (params.queryParams.lang) {
      lang = params.queryParams.lang;
    }
    else if (sessionStorage.getItem('lang')) {
      lang = sessionStorage.getItem('lang');
    }

    this.set('i18n.locale', lang);
    sessionStorage.setItem('lang', lang);

    this._super();
  },

  sessionAuthenticated() { // https://github.com/simplabs/ember-simple-auth/issues/1618
    if (this.get('session.previousRouteName')) {
      this.transitionTo(this.get('session.previousRouteName'));
    } else {
      this._super(...arguments);
    }
  },
  actions: {

    willTransition(transition) {
      if (window.location.pathname !== "/login") {
        this.set('session.previousRouteName', window.location.pathname + "/" + window.location.search);
      }
      transition.then(() => { // https://github.com/simplabs/ember-simple-auth/issues/1618 (modified above to add queryparams)
        if (window.location.pathname !== '/login') {
          this.set('session.previousRouteName', window.location.pathname);
        }
      });
    },
    toggleLang: function() {
      if (this.get('i18n.locale') === 'sv') {
        this.set('i18n.locale', 'en');
        this.set("lang", 'en');
        sessionStorage.setItem('lang', 'en');
      } else {
        this.set('i18n.locale', 'sv');
        sessionStorage.setItem('lang', 'sv');
        this.set("lang", 'sv');
      }
      Ember.run.later(function() {
        //location.reload(true);
      });
    },

    loading(transition) {
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
      this.store.find('userdata', this.get('session.data.authenticated.username')).then((data) => {
        this.controllerFor("application").set("userdata", data);
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
      Ember.run.later(() => {
        this.send('hideMsgHeader');
      }, 2500);
    },
    showPublication: function(publication_id) {
      this.controller.set('publication_id', null);
      this.controller.set('publication_id_error', null);

      let successHandler = () => {
        this.transitionTo('publications.dashboard.manage.show', publication_id);
      };
      let errorHandler = () => {
        this.controller.set('publication_id_error', this.get('i18n').t('mainMenu.idMissing') + ': ' + publication_id);
      };
      let generalHandler = (model) => {
        if (model.error) {
          errorHandler();
        }
        else {
          successHandler();
        }
      };
      if (publication_id) {
        this.store.find('publication', publication_id).then(generalHandler);
      }
    },
    pageIsDisabled(transition) {
      let controller = this.controllerFor('application');
      controller.set('pageIsDisabled', true);
      Ember.run.schedule('afterRender', this, function() {
        Ember.$('#page-disabled-overlay').fadeTo(400, 0.25, () => {
          controller.set('currentlyLoading', true);
        });
      });
      let enablePage = Ember.run.bind(this, function() {
        controller.set('currentlyLoading', false);
        Ember.$('#page-disabled-overlay').stop(true, false).fadeTo(200, 1, () => {
          Ember.run(() => {
            controller.set('pageIsDisabled', false);
          });
        });
      });
      // Restore page both regardless of resolved or rejected
      transition.then(enablePage, enablePage);
    }
  }
});
