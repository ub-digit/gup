import Ember from 'ember';

export default Ember.Controller.extend({

  isError: Ember.computed.equal('msgType', 'error'),
  actions: {
  	toggleLang: function() {
  		var set = Ember.set;
		var application = this.container.lookup('application:main');

		if (!application.locale) {
			set(application, 'locale', application.get('defaultLocale'))
		}

		if (application.locale === 'sv') {
			set(application, 'locale', 'en');
		}
		else {
			set(application, 'locale', 'sv');
		}
		
  	}
  }
});
