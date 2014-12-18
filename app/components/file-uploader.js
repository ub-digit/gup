import Ember from 'ember';
import ENV from 'gup/config/environment';
export default Ember.FileField.extend({
  filesDidChange: (function() {
    console.log('HÄJ');
    var controller = this.get('targetObject');
    var that=this;
    var successHandler = function() {
      controller.set('hasMesg', true);
      controller.set('showMesgHeader', true);
      controller.set('mesg', 'Det blev rätt');
      that.triggerAction({action: 'refreshLists'});
      that.set('value', '');
      controller.transitionToRoute('publications.manage');
    };
    var errorHandler = function(reason) {
      console.log(reason);
      controller.set('hasErrors', true);
      controller.set('showMesgHeader', true);
      controller.set('errors', reason.responseJSON.errors);
      return false;
    };
    var files = this.get('files');

    var uploader = Ember.Uploader.create({
      url: ENV.APP.serviceURL + '/publications/import_file'
    });

    if (!Ember.isEmpty(files)) {
      uploader.upload(files[0]).then (successHandler, errorHandler);
    }
  }).observes('files')
});
