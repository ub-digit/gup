import Ember from 'ember';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  deletePublication: function(id) {
    var that = this;
    this.store.destroy('publication', id).then(function() {
      that.send('setMsgHeader', 'success', that.get('i18n').t('messages.deleteDraftSuccess'));
      that.send('refreshModel');
    },
    function() {
      that.send('setMsgHeader', 'success', that.get('i18n').t('messages.deleteDraftError'));
    });
  },
  actions: {
    delete: function(id) {
      var txt;
      var r = confirm(this.get('i18n').t('messages.confirmDeleteDraft'));
      if (r == true) {
        this.deletePublication(id);
      }
    }
  }
});
