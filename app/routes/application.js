import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {

	beforeModel: function() {
		this._super();
	//	this.transitionTo('login');
		if (this.get("session.authenticated")) {
			//console.log("session", this.get("session"));
		//	this.transitionTo('publications.manage');
		}
		else {
			this.transitionTo('login');
		}
	},

	actions: {
		sessionAuthenticationSucceeded: function() {
		//Ember.run.later(Ember.$('body').removeClass("loading"));
			this.transitionTo("publications.manage.dashboard.drafts");
			Ember.run.later(function() {Ember.$('body').removeClass("loading")});
	    //	return this._super();	
	    },
		sessionAuthenticationFailed: function(error) {
			Ember.$('body').removeClass("loading");
		    this.controllerFor('login').set('error', error.msg);
		},
	}
});
