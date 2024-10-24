import Ember from 'ember';
export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('login.title_page');
  },
});
