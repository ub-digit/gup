import Ember from 'ember';
import ENV from 'gup/config/environment';
export default Ember.FileField.extend({
  filesDidChange: (function() {
  console.log('HÄJ');
    var files = this.get('files');

    var uploader = Ember.Uploader.create({
      url: ENV.APP.serviceURL + '/publications/import_file'
    });

    if (!Ember.isEmpty(files)) {
      uploader.upload(files[0]);
    }
  }).observes('files')
});
