import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend(LoginControllerMixin, {
	application: Ember.inject.controller(),
  authenticator: 'authenticator:custom',
  error: {},
});
