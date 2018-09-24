import Ember from 'ember';
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
    });
    //this.attrs.parentResetState.update(this.get('resetState'));

    this.set('uploadFile', (file) => {
      const token = this.get('session.data.authenticated.token');
      if (!token) { Ember.RSVP.Promise.reject('Invalid token'); }

      var preFilters = Ember.$.Callbacks();

      var authPrefilter = function(options) {
        if(!options.headers) {
          options.headers = {};
        }
        options.headers['Authorization'] = "Token " + token;
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
      return uploader.upload(file, data).catch((errorResponse) => {
        let errorMsg = 'responseJSON' in errorResponse ? errorResponse.responseJSON.error.msg : errorResponse.statusText;
        this.set('fileUploadProgress', null);
        throw errorMsg;
      }).finally(() => {
        preFilters.remove(authPrefilter);
      });
    });
    // Force two way binding
    if (this.attrs.parentUploadFile !== undefined) {
      this.attrs.parentUploadFile.update(this.get('uploadFile'));
    }
  },
  filesDidChange(files) {
    let file = Ember.isEmpty(files) ? files : files[0];
    this.sendAction('fileDidChange', file);
  }
});
