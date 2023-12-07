import Ember from 'ember';


export default Ember.Controller.extend({
  session: Ember.inject.service(),
  application: Ember.inject.controller(),

  errorMessage: false,
  invalidCredentials: false,
  loginDisabled: false,

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      this.get('session').authenticate(
        'authenticator:gub',
        { identification: identification, password: password }
      ).catch((reason) => {
        //this.set('invalidCredentials', reason.error || reason);
        this.set('invalidCredentials', true);
      });
    },

    authenticateOAuth2() {
      this.set('invalidCredentials', false); //Or skip this??
      this.set('loginDisabled', true);
      this.get('session').authenticate('authenticator:torii', 'gub')
      .catch((reason) => {
        this.set('errorMessage', reason.error.msg);
      })
      .finally(() => {
        this.set('loginDisabled', false);
      })
    }
  }
});
