import Ember from 'ember';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),
  showReviewCount: Ember.computed.gt('application.userdata.counts.review', 0)
});
