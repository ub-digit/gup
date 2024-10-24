import Ember from 'ember';
import ENV from 'frontend/config/environment';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  session : Ember.inject.service('session'),
  config: ENV.torii.providers['gub-oauth2'], //TODO: Why do we need this, do we need this?

  queryParams: ['lang'],
  lang : null,
  isError: Ember.computed.equal('msgType', 'error'),
  showReviewCount: Ember.computed.gt('userdata.counts.review', 0),
  pageIsDisabled: false,
  currentlyLoading: false,
  isEnglish: Ember.computed('i18n', function() {
    let lang = this.get("i18n.locale");
    if (lang === "en") {return true;}
    return false;
  }),

  actions: {
    toggleLang: function(language) {
      if (language) {
        this.set('i18n.locale', language);
      }
      else {
        if (this.get('i18n.locale') === 'sv') {
          this.set('i18n.locale', 'en');
          sessionStorage.setItem('lang', 'en');
          this.set("lang", 'en');
        } else {
          this.set('i18n.locale', 'sv');
          sessionStorage.setItem('lang', 'sv');
          this.set("lang", 'sv');
        }
      }
      Ember.run.later(function() {
        location.reload(true);
      });
    },
  }
});
