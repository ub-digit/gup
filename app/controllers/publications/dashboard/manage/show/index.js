import Ember from 'ember';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  session: Ember.inject.service(),
  applicationController: Ember.inject.controller('application'),
  publicationsController: Ember.inject.controller('publications'),
  publicationsShowController: Ember.inject.controller('publications/dashboard/manage/show'),
  isExtendedViewMode: false,
  queryParams: ['other_version'],
  other_version: null,

  error: Ember.computed('model.error', function(){
    if (this.get('model.error')) {
      return true;
    }
    return false;
  }),

  deletePublication: function(id) {
    var that = this;
    this.store.destroy('publication', id).then(function() {
      that.send('setMsgHeader', 'success', that.get('i18n').t('publications.dashboard.manage.show.index.deletePublicationSuccess'));
      var target = that.get('applicationController.currentList') || 'publications.dashboard.manage.drafts';
      that.transitionToRoute(target);
    },
    function() {
      that.send('setMsgHeader', 'error', that.get('i18n').t('publications.dashboard.manage.show.index.deletePublicationError'));
    });
  },
  approvePublication: function(id) {
    var that = this;
    this.store.save('biblreview_publication', {id: id}).then(function() {
      that.send('setMsgHeader', 'success', that.get('i18n').t('publications.dashboard.manage.show.index.approvePublicationSuccess'));
      that.transitionToRoute('publications.dashboard.biblreview');
    },
    function() {
      that.send('setMsgHeader', 'error', that.get('i18n').t('publications.dashboard.manage.show.index.approvePublicationError'));
    });
  },

  //advancedMode: Ember.computed('session.content.can_biblreview', 'viewMode', function() {
  //  var is_reviewer = this.get('session.content.can_biblreview');
  //  var view_mode = this.get('viewMode');
  //  return (is_reviewer && (view_mode === 'advanced'));
  //}),

  getPublicationTypeObject: Ember.computed('model.publication_type', function(){
    return this.get("publicationsController.publicationTypes").findBy("id", this.get("model.publication_type_id"));
  }),

  actions: {
    goBack: function() {
      var target = this.get('applicationController.currentList');
      if (!target) {
        window.history.back();
        return;
      }
      this.transitionToRoute(target);
    },
    deletePublication: function(id) {
      var r = confirm(this.get('i18n').t('publications.dashboard.manage.show.index.confirmDeletePublication'));
      if (r === true) {
        this.deletePublication(id);
      }
    },
    approvePublication: function(id) {
      this.approvePublication(id);
    },
    toggleViewMode: function() {
      this.toggleProperty('isExtendedViewMode');
    },
    toggleCompareMode: function() {
      this.toggleProperty('isExtendedCompareMode');
    }
  }
});
