import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application', 'publications', 'publications/show'],
  viewModeBinding: 'controllers.publications/show.viewMode',

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
  approvePublication: function(id) {
    var that = this;
    that.send('setMsgHeader', 'success', 'iiiiii oooooooooo ');
    that.transitionToRoute('publications.dashboard.biblreview');
  },

  advancedMode: Ember.computed('session.content.can_bibreview', 'controllers.publications/show.viewMode', function() {
    var is_reviewer = this.get('session.content.can_bibreview');
    var view_mode = this.get('controllers.publications/show.viewMode');
    console.log("VAR INNE I COMPUTED PROPERY VID NAMN: advancedMode");

    return (is_reviewer && (view_mode === 'advanced'));
  }),

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
    },
    approvePublication: function(id) {
        console.log('XXXXXXX');
        this.approvePublication(id);
    }
  }
});
