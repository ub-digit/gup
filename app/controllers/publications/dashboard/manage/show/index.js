import Ember from 'ember';
import ENV from '../../../../../config/environment'; //TODO: Sane way of getting path

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  session: Ember.inject.service(),
  applicationController: Ember.inject.controller('application'),
  publicationsController: Ember.inject.controller('publications'),
  publicationsShowController: Ember.inject.controller('publications/dashboard/manage/show'),
  isExtendedViewMode: false,
  queryParams: ['other_version'],
  other_version: null,
  //AssetData
  assetDataErrors: Ember.A([]),
  assetDataBaseUrl: ENV.APP.fileURL,
  assetDataLicenceUrl: ENV.APP.licenceURL,
  assetDataLicenceCode: ENV.APP.licenceCode,
  assetDataIsAccepted: false,
  assetDataIsEmbargo: false,
  assetDataEmbargoDate: Date(),

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

  fileUrl: Ember.computed('assetDataBaseUrl', 'assetData', function() {
    const assetData = this.get('assetData');
    if (assetData) {
      const token = this.get('session.data.authenticated.token');
      return this.get('assetDataBaseUrl')+
        '/'+assetData.id+
        '?tmp_token='+assetData.tmp_token+
        '&token='+token;
    } else {
      return null;
    }
  }),

  hasAssetDataErrors: Ember.computed('assetDataErrors', function() {
    return Ember.isPresent(this.get('assetDataErrors'));
  }),

  actions: {
    didUploadAssetDataFile: function(response) {
      if('asset_data' in response) {
        this.set('assetData', response.asset_data);
      }
    },
    assetDataFileUploadDidErr: function(errorResponse) {
      this.set('assetData', null);
    },
    didSaveAssetData: function(success, error) {
      if (this.get('assetDataIsEmbargo')) {
        this.set('assetData.visible_after', this.get('assetDataEmbargoDate'));
      }
      else {
        this.set('assetData.visible_after', null);
      }
      if(this.get('assetDataIsAccepted')) {
        this.set('assetData.accepted', this.get('assetDataLicenceCode'));
      } else {
        this.set('assetData.accepted', null);
      }
      this.store.save('asset_data', this.get('assetData')).then((model) => {
        //TODO: can remove this?
        if (model.error) {
          error("Du måste godkänna avtalet nedan");
        }
        else {
          //TODO: verify this is really used somewhere, can't find it
          this.send('setMsgHeader', 'success', 'Filen sparades');
          //this.send('refreshModel', this.get('publication.id'));
          this.send('refreshModel');
          success();
        }
      }, (errorResponse) => {
        if(errorResponse.error) {
          error(errorResponse.error.msg);
        }
        else {
          //TODO: Handle backend crash error!
        }
      });
    },
    //TODO: better way?
    didCancelAssetData : function() {
      this.set('assetDataErrors', Ember.A([]));
      this.set('assetDataIsAccepted', false);
      this.set('assetDataIsEmbargo', false);
      this.set('assetDataEmbargoDate', Date());
      this.set('assetData', undefined);
    },

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
