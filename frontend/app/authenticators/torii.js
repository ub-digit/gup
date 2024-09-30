import Ember from 'ember';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import config from 'frontend/config/environment';

export default ToriiAuthenticator.extend({
  i18n: Ember.inject.service(),
  torii: Ember.inject.service(),
  ajax: Ember.inject.service(),

  restore: function(properties) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        type: 'GET',
        url: config.APP.authenticationBaseURL+'/'+properties.token
      }).then(function() {
        resolve(properties);
      }, function() {
        reject();
      });
    });
  },

  authenticate() {
    let i18n = this.get('i18n');
    const ajax = this.get('ajax');
    const tokenExchangeUri = config.torii.providers['gub-oauth2'].tokenExchangeUri;

    return this._super(...arguments).then((data) => {
      return ajax.request(tokenExchangeUri, {
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          code: data.authorizationCode
        })
      }).then((response) => {
        return {
          authenticated: true,
          token: response.access_token,
          username: response.user.username,
          name: response.user.name,
          userid: response.user.id,
          can_delete_published : Ember.$.inArray('delete_published', response.user.role.rights) !== -1,
          can_biblreview : Ember.$.inArray('biblreview', response.user.role.rights) !== -1,
          can_administrate : Ember.$.inArray('administrate', response.user.role.rights) !== -1,
          provider: data.provider
        };
      }).catch((error) => {
        if (error.errors[0].status === '403') {
          throw i18n.t('login.loginNotAllowed');
        }
        else {
          throw i18n.t('login.loginGeneralError');
        }
      });
    }).catch((error) => {
      // Here we can handle errors from the authentication process where the user cancels the login
      // (e.g. Error: remote was closed, authorization was denied, or an authentication message otherwise not received before the window closed.)
      throw i18n.t('login.loginExternalError');
    });
  }

});
