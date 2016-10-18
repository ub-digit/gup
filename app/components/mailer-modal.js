import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: '',

  didRender() {
    let that = this;
    Ember.$('#mailerModal').on('show.bs.modal', function (e) {
      that.set("error", null);
      that.set("hasSuccess", null);
    })
  },

  setMsgHeaderAction: 'setMessage',

  actions: {
    sendMail: function(){
      this.set("error", null);
      this.set("hasSuccess", null);
      var that = this;
      var publication = this.get('publication');
      var message = this.get('message');

      var successHandler = function(model) {
        that.set("hasSuccess", true);
        that.set("message", '');
        Ember.$('#mailerModal').modal('hide');   
        that.sendAction("setMsgHeaderAction", 'success', that.get("i18n").t('components.mailerModal.successMessage'));     
      }
      var errorHandler = function(model) {
        that.set("error", model.error);
      };
      var generalHandler = function(model) {
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
