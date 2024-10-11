import Oauth2 from 'torii/providers/oauth2-code';
import { configurable } from 'torii/configuration';
import config from 'frontend/config/environment';

export default Oauth2.extend({
  name: 'gub-oauth2',
  baseUrl: config.APP['gub-oauth2'].authorizeUri,
  responseParams: ['code', 'state'],

  redirectUri: configurable('redirectUri', function(){
    // A hack that allows redirectUri to be configurable
    // but default to the superclass
    return this._super();
  }),

  fetch(data) {
    return Ember.$.ajax({
      type: 'GET',
      url:`${config.APP.authenticationBaseURL}/${data.token}`
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
          provider: data.provider // Does not seems to be required??
        };
      })
      .catch((error) => {
        //TOODO: HOw to provide user feedback, seems like this is caught by adapter if thrown!?
        this.session.invalidate();
      });
  }
});
