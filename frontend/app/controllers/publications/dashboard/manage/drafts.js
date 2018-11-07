import Ember from 'ember';

export default Ember.Controller.extend({
  manageController: Ember.inject.controller("publications.dashboard.manage"),
  page: 1,
  queryParams: ['page'],


  i18n: Ember.inject.service(),
  deletePublication: function(id) {
    var that = this;
    this.store.destroy('draft', id).then(function() {
      that.send('setMsgHeader', 'success', that.get('i18n').t('publications.dashboard.manage.drafts.deleteDraftSuccess'));
      that.send('refreshModel');
    },
    function() {
      that.send('setMsgHeader', 'success', that.get('i18n').t('publications.dashboard.manage.drafts.deleteDraftError'));
    });
  },
  actions: {
    delete: function(id) {
      var r = confirm(this.get('i18n').t('publications.dashboard.manage.drafts.confirmDeleteDraft'));
      if (r === true) {
        this.deletePublication(id);
      }
    }
  }
});
