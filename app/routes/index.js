import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
		var defaultLang = this.controllerFor("application").getDefaultLocale();
		this.transitionTo('publications.dashboard.drafts', {queryParams: {lang: defaultLang}});
	}
});
