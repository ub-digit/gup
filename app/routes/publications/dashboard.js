import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
	session: Ember.inject.service('session'),



	beforeModel: function() {
		//this.transitionTo("publications.dashboard.start")
	},

	setupController: function(controller, model) {
      if (this.get('session.data.authenticated.can_biblreview')) {
        this.controllerFor("application").set('viewMode', 'advanced');
      }
      controller.fetchUserdataLoop(60000);
      //  return this._super();
	}
});
