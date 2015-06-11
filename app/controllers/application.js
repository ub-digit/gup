import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['lang'],
	lang : null,
	isError: Ember.computed.equal('msgType', 'error'),
	getDefaultLocale: function() {
		var application = this.container.lookup('application:main');
		return application.get('defaultLocale');
	},

	setLocale: function() {
		var set = Ember.set;
		var application = this.container.lookup('application:main');

		if (this.get("lang")) {
			set(application, 'locale', this.get("lang"));
		}
		else {
			set(application, 'locale', application.get('defaultLocale'));
			this.set("lang",  application.get('defaultLocale'));
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
				this.setLocale();
			}
			else {
				this.set("lang", this.getDefaultLocale());
			}
		}
	}
});
