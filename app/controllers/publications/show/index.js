import Ember from 'ember';

export default Ember.Controller.extend({
  applicationController: Ember.inject.controller("application"),
  publicationsController: Ember.inject.controller("publications"),
  publicationsShowController: Ember.inject.controller("publications/show"), 
  viewModeBinding: 'applicationsController.viewMode',

  deletePublication: function(id) {
    var that = this;
    this.store.destroy('publication', id).then(function() {
        that.send('setMsgHeader', 'success', that.get('i18n').t('messages.deletePublicationSuccess'));
        that.transitionToRoute('application');
    },
    function() {
      that.send('setMsgHeader', 'success', that.get('i18n').t('messages.deletePublicationError'));
    });
  },
  approvePublication: function(id) {
    var that = this;
    this.store.find('bibl_review', id).then(function() {
        that.send('setMsgHeader', 'success', that.get('i18n').t('messages.approvePublicationSuccess'));
        that.transitionToRoute('publications.dashboard.biblreview');
    },
    function() {
      that.send('setMsgHeader', 'success', that.get('i18n').t('messages.approvePublicationError'));
    });
  },

  advancedMode: Ember.computed('session.content.can_bibreview', 'viewMode', function() {
    var is_reviewer = this.get('session.content.can_bibreview');
    var view_mode = this.get('viewMode');
    return (is_reviewer && (view_mode === 'advanced'));
  }),

  getPublicationTypeObject: Ember.computed('model.publication_type', function(){
    return this.get("publicationsController.publicationTypes").findBy("code", this.get("model.publication_type"));
  }),

  actions: {
    goBack: function() {
      var target = this.get('applicationController.currentList') || 'publications.dashboard.drafts';
      this.transitionToRoute(target);
    },
    deletePublication: function(id) {
      var r = confirm(this.get('i18n').t('messages.confirmDeletePublication'));
      if (r === true) {
        this.deletePublication(id);
      }
    },
    approvePublication: function(id) {
        this.approvePublication(id);
    }
  }
});
