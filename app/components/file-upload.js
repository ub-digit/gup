import Ember from 'ember';
import ENV from 'gup/config/environment';
import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
  session: Ember.inject.service('session'),
  multiple: false,
  init: function() {
    this._super(...arguments);
    this.set('resetState', () => {
      this.set('value', '');
      // Only triggers filesDidChange if not empty:
      //https://github.com/benefitcloud/ember-uploader/blob/master/addon/components/file-field.js
      //TODO: this is weird
      this.filesDidChange(null);
      this.set('fileUploadProgress', null);
      this.get('fileUploadErrors').clear();
    });
    //TODO: understand this:
    this.attrs.parentResetState.update(this.get('resetState'));
  },
  filesDidChange(files) {
    let file = Ember.isEmpty(files) ? files : files[0];
    this.sendAction('fileDidChange', file);
    if (Ember.isEmpty(file)) {
      return;
    }
    const token = this.get('session.data.authenticated.token');
    if (!token) { return; }

    var preFilters = Ember.$.Callbacks();

    var authPrefilter = function(options) {
      if(!options.headers) {
        options.headers = {};
      }
      options.headers['Authorization'] = "Token "+token;
      return options;
    };

    const uploader = EmberUploader.Uploader.create({
      url: this.get('uploadUrl')
    });

    uploader.on('progress', e => {
      // Handle progress changes
      // Use `e.percent` to get percentage
      this.set('fileUploadProgress', e.percent);
    });

    Ember.$.ajaxPrefilter(preFilters.fire);
    preFilters.add(authPrefilter);

    let data = Ember.isPresent(this.get('uploadExtraData')) ? this.get('uploadExtraData') : {}; //Hmm??
    uploader.upload(file, data).then((response) => {
      this.get('fileUploadErrors').clear();
      this.sendAction('didUploadFile', response);
    }, (errorResponse) => {
      //TODO: Gah, naming
      this.sendAction('fileUploadDidErr', errorResponse);
      let errorMsg = 'responseJSON' in errorResponse ? errorResponse.responseJSON.error.msg : errorResponse.statusText;
      this.get('fileUploadErrors').clear();
      this.get('fileUploadErrors').pushObject(errorMsg);
      this.set('fileUploadProgress', null);
    }).then(() => {
      preFilters.remove(authPrefilter);
    });
  }
});
