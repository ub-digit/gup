import Ember from 'ember';

export default Ember.Controller.extend({
	selectedPublicationType: null,

	selectedPublicationTypeChanged: function() {
		alert("changed");
	}.observes('selectedPublicationType')
});
