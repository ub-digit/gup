import Ember from 'ember';
import ENV from 'gup/config/environment';
import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
  session: Ember.inject.service('session'),
  multiple: false,
  firstQueryOfProgress: true,
  didInsertElement() {
    Ember.$('#gup-progress-bar').hide();
  },

  //didUploadAsset

  filesDidChange: (function(files) {
    this.set('firstQueryOfProgress', true);
    var that = this;
    if (Ember.isEmpty(files)) {
      return;
    }

    var uploadUrl = ENV.APP.fileURL;
    var token = this.get('session.data.authenticated.token');

    if (!token) { return; }

    var preFilters = Ember.$.Callbacks();

    var authPrefilter = function(options) {
      if(!options.headers) {
        options.headers = {};
      }
      options.headers['Authorization'] = "Token "+token;
      return options;
    };

    var uploader = EmberUploader.Uploader.create({
      url: uploadUrl
    });

    uploader.on('progress', e => {
      // Handle progress changes
      // Use `e.percent` to get percentage
      if (this.get('firstQueryOfProgress')) {
        Ember.$('#gup-progress-bar').show();
      }
      this.set('firstQueryOfProgress', false);
      that.set('fileUploadProgress', e.percent);
    });

    uploader.on('didUpload', response => {
      this.set('fileUploadError', null);
      this.set('assetData', response.asset_data);
      this.sendAction('didUploadAsset', response.asset_data);
      this.set('value', ''); //??
      preFilters.remove(authPrefilter);
      Ember.$('#fileUploadModal').modal('show');
    });

    uploader.on('didError', (jqXHR, textStatus, errorThrown) => {
      let errorMsg = jqXHR.responseJSON.error.msg;
      Ember.$('#gup-progress-bar').hide();
      that.set('fileUploadError', errorMsg);
    });

    if (!Ember.isEmpty(files)) {
      Ember.$.ajaxPrefilter(preFilters.fire);
      preFilters.add(authPrefilter);
      let data = Ember.isPresent(this.get('uploadExtraData')) ? this.get('uploadExtraData') : {}; //Hmm??
      uploader.upload(files[0], data);
    }
  })
});
