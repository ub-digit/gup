import Ember from 'ember';

export default Ember.Component.extend({
  isShowingModal: false,
  i18n: Ember.inject.service(),
  error: null,
  modalTitle: null,
  cancelText: null,
  confirmText: null,
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
    didSubmit() {
      if (Ember.isPresent(this.get('didConfirm'))) {
        //Disable controls while resolving promise?
        this.didConfirm().then(() => {
          this.set('error', null);
          this.send('hideModal');
        }, (error) => {
          //Perhaps remove this, only handle success?
          //This feels dodgy
          //TODO: format of error message? error.msg?
          if(Ember.typeOf(error) === 'string') {
            this.set('error', error);
          } else {
            this.set('error', this.get('i18n').t('components.confirmationModal.unknownError'));
          }
        });
      }
    },
    showModal() {
      this.set('isShowingModal', true);
    },
    hideModal() {
      this.set('isShowingModal', false);
    },
  }
});
