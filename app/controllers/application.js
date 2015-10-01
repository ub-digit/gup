import Ember from 'ember';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
	queryParams: ['lang'],
	lang : null,
	isError: Ember.computed.equal('msgType', 'error'),
  viewMode: 'basic',
  isViewModeAdvanced: Ember.computed.equal('viewMode', 'advanced'),
  isViewModeBasic: Ember.computed.equal('viewMode', 'basic'),
	getDefaultLocale: function() {
		var application = this.container.lookup('application:main');
		return application.get('defaultLocale');
	},

	setLocale: function() {
		if (this.get("lang")) {
      this.set('i18n.locale', this.get('lang'));
		}
	},
	actions: {
		toggleLang: function() {
			var lang = this.get("lang");
			if (lang) {
				if (lang === "en") {
					this.set("lang", 'sv');
				}
				else {
					this.set("lang", 'en');
				}
				//this.setLocale();
			}
			else {
				this.set("lang", this.getDefaultLocale());
			}
			Ember.run.later(function() {
				location.reload(true);
			})
			
		}
	}
});
