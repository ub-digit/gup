import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],

  deletePublication: function(id) {
    var that = this;
    this.store.destroy('publication', id).then(function() {
      that.send('setMsgHeader', 'success', that.t('messages.deletePublicationSuccess'));
			that.transitionToRoute('application');
    },
    function() {
      that.send('setMsgHeader', 'success', that.t('messages.deletePublicationError'));
    });
  },

  actions: {
    goBack: function() {
      var target = this.get('controllers.application.currentList') || 'publications.dashboard.drafts';
      this.transitionToRoute(target);
    },
    deletePublication: function(id) {
      var r = confirm(this.t('messages.confirmDeletePublication'));
      if (r === true) {
        this.deletePublication(id);
      }
    }
  }
});
