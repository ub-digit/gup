import Ember from 'ember';


export default Ember.Controller.extend({
  session: Ember.inject.service(),
  application: Ember.inject.controller(),

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:gub', {identification: identification, password: password}).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    },
    authenticationSucceeded: function() {
		alert("hello");
    }
  }
});