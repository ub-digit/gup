import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: '',
  setMsgHeaderAction: 'setMessage',

  didRender() {
    Ember.$('#mailerModal').on('show.bs.modal', () => {
      this.set('error', null);
      this.set('hasSuccess', null);
    });
  },

  actions: {
    sendMail: function(){
      this.set('error', null);
      this.set('hasSuccess', null);
      let publication = this.get('publication');
      let message = this.get('message');

      let successHandler = () => {
        this.set('hasSuccess', true);
        this.set('message', '');
        Ember.$('#mailerModal').modal('hide');
        this.sendAction('setMsgHeaderAction', 'success', this.get('i18n').t('components.mailerModal.successMessage'));
      };
      let errorHandler = (model) => {
        this.set('error', model.error.msg);
      };
      let generalHandler = (model) => {
        if (model.error) {
          errorHandler(model);
        }
        else {
          successHandler(model);
        }
      };
      this.store.save('feedback_mail',{message: message, from: 'from_person', publication_id: publication.id}).then(generalHandler);
    }
  }
});
