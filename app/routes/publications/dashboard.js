import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
	session: Ember.inject.service('session'),


	model: function() {
	  return Ember.RSVP.hash({
	      news_message: this.store.find('message', 'NEWS'),
	      alert_message: this.store.find('message', 'ALERT')
    	});
    },
	beforeModel: function() {
		//this.transitionTo("publications.dashboard.start")
	},

	setupController: function(controller, model) {
    	this._super(...arguments);
    	this.controllerFor("application").set('messages', model);
    	
      if (this.get('session.data.authenticated.can_biblreview')) {
        this.controllerFor("application").set('viewMode', 'advanced');
      }
      controller.fetchUserdataLoop(60000);
      //  return this._super();
	}
});
