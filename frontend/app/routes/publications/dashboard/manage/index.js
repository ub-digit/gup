import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {

	beforeModel: function() {
    	this.transitionTo('publications.dashboard.manage.published');
	},

	setupController: function(controller) {
		controller.set("isNavVisible", true);
	}
});
