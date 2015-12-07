import Ember from 'ember';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
	queryParams: ['lang'],
	lang : null,
	isError: Ember.computed.equal('msgType', 'error'),

	actions: {
		toggleLang: function() {
      if (this.get('i18n.locale') === 'sv') {
        this.set('i18n.locale', 'en');
        sessionStorage.setItem('lang', 'en');
      } else {
        this.set('i18n.locale', 'sv');
        sessionStorage.setItem('lang', 'sv');
      }
      Ember.run.later(function() {
        location.reload(true);
      })
		}
	}
});
