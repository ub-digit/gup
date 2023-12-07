import Ember from 'ember';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import config from 'frontend/config/environment';

export default ToriiAuthenticator.extend({
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
        throw error.errors[0].detail;
      });
    });
  }

});
