import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  isShowing: false,
  error: null,
  modalTitle: null,
  cancelText: null,
  confirmText: null,
  usesTransition: true,
  init() {
    this._super(...arguments);
    if (Ember.isBlank(this.get('modalTitle'))) {
      this.set('modalTitle', this.get('i18n').t('components.confirmationModal.modalTitle'));
    }
    if (Ember.isBlank(this.get('cancelText'))) {
      this.set('cancelText', this.get('i18n').t('components.confirmationModal.cancelText'));
    }
    if (Ember.isBlank(this.get('confirmText'))) {
      this.set('confirmText', this.get('i18n').t('components.confirmationModal.confirmText'));
    }
  },
  actions: {
    didConfirm() {
      // @TODO: check if promise or ordinary function?
      if (Ember.isPresent(this.get('didConfirm'))) {
        // Disable controls while resolving promise?
        this.didConfirm().then(() => {
          this.set('error', null);
          this.set('isShowing', false);
        }, (error) => {
          // Perhaps remove this, only handle success? Feels dodgy
          // @TODO: format of error message? error.msg?
          if(Ember.typeOf(error) === 'string') {
            this.set('error', error);
          } else {
            this.set('error', this.get('i18n').t('components.confirmationModal.unknownError'));
          }
        });
      }
    }
  }
});
