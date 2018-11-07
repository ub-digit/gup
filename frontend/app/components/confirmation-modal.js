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
      let didConfirm = this.get('didConfirm');
      let closeAndReset = () => {
        this.set('error', null);
        this.set('isShowing', false);
      };
      if (Ember.isPresent(didConfirm)) {
        // If is promise
        if(typeof didConfirm === 'function') {
          didConfirm();
          closeAndReset();
        } else if(typeof didConfirm === 'object' && typeof didConfirm.then === 'function') {
          // Disable controls while resolving promise?
          this.didConfirm().then(() => {
            closeAndReset();
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
        else {
          throw "Invalid type for property 'didConfirm'";
        }
      }
      else {
        closeAndReset();
      }
    }
  }
});
