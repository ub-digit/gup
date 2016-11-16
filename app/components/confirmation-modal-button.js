import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  error: null,
  isShowingModal: false,
  init() {
    this._super(...arguments);
  },
  actions: {
    showModal() {
      this.set('isShowingModal', true);
    },
    hideModal() {
      this.set('isShowingModal', false);
    }
  }
});
