import Ember from 'ember';


export default Ember.Controller.extend({
  session: Ember.inject.service(),
  application: Ember.inject.controller(),

  errorMessage: false,
  loginDisabled: false,

  actions: {
    authenticateOAuth2() {
      this.set('loginDisabled', true);
      this.get('session').authenticate('authenticator:torii', 'gub')
      .catch((reason) => {
        this.set('errorMessage', reason);
      })
      .finally(() => {
        this.set('loginDisabled', false);
      })
    }
  }
});
