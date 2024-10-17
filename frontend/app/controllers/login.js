import Ember from 'ember';


export default Ember.Controller.extend({
  session: Ember.inject.service(),
  i18n: Ember.inject.service(),
  application: Ember.inject.controller(),
  errorMessage: false,
  loginDisabled: false,

  actions: {
    authenticateOAuth2() {
      this.set('loginDisabled', true);
      this.get('session').authenticate('authenticator:torii', 'gub')
      // Fix me: Error handling should be more structured.
      .catch((error) => {
        // When the error response is initated by backend, the error object is an array, and the status can be found in the first element of the array.
        if (error.errors && error.errors[0].status === '403') {
          this.set('errorMessage', this.get('i18n').t('login.loginNotAllowed'));
        }
        else {
          if (error.errors && error.errors[0].status === '401') {
            this.set('errorMessage', this.get('i18n').t('login.loginGeneralError'));
          }
          else {
            // When the error response is initiated by the frontend (torii), e.g. when the login window is closed by the user, the error object is a string.
            this.set('errorMessage', this.get('i18n').t('login.loginExternalError'));
          }
        }
      }).finally(() => {
        this.set('loginDisabled', false);
      })
    }
  }
});
