import Ember from 'ember';

export default Ember.Controller.extend({

  deletePublication: function(id) {
    var that = this;
    this.store.destroy('publication', id).then(function() {
      that.send('setMsgHeader', 'success', that.t('messages.deleteDraftSuccess'));
      that.send('refreshModel');
    },
    function() {
      that.send('setMsgHeader', 'success', that.t('messages.deleteDraftError'));
    });
  },
  actions: {
    delete: function(id) {
      var txt;
      var r = confirm(this.t('messages.confirmDeleteDraft'));
      if (r == true) {
        this.deletePublication(id);
      }
    }
  }
});
