import Ember from 'ember';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  session : Ember.inject.service('session'),

	queryParams: ['lang'],
	lang : null,
	isError: Ember.computed.equal('msgType', 'error'),
  showReviewCount: Ember.computed.gt('userdata.counts.review', 0),
  pageIsDisabled: false,

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
      });
		},
	}
});
