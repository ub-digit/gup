import Ember from 'ember';

export default Ember.Controller.extend({
	session: Ember.inject.service('session'),
	application: Ember.inject.controller(),
	showReviewCount: Ember.computed.gt('application.userdata.counts.review', 0),

	fetchUserdata: function() {
		var that = this;
		this.store.find('userdata', this.get('session.data.authenticated.username')).then(function(data) {
			that.set("application.userdata", data);
		});
	},
	fetchUserdataLoop: function(interval) {
		if (this.get("application.userdata_active")) {
			return false;
		}

		this.set("application.userdata_active", true);
		if(!interval) { interval = 60000; }
		this.fetchUserdata();
		Ember.run.later(this, function() {
			this.fetchUserdataLoop();
		}, interval);



	},

});
