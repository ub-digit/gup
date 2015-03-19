import Ember from 'ember';
import ENV from 'gup/config/environment';
export default Ember.FileField.extend({
  filesDidChange: (function() {
    var controller = this.get('targetObject');
    var that=this;
    var successHandler = function() {
      controller.set('hasMesg', true);
      controller.set('showMesgHeader', true);
      controller.set('mesg', 'Success');
      that.set('value', '');
      controller.transitionToRoute('publications.manage');
      preFilters.remove(authPrefilter);
    };

    var errorHandler = function(reason) {
      console.log(reason);
      controller.set('hasErrors', true);
      controller.set('showMesgHeader', true);
      controller.set('errors', reason.responseJSON.errors);
      preFilters.remove(authPrefilter);
      return false;
    };

    var files = this.get('files');
    var token = this.container.lookup('simple-auth-session:main').get('token');
    var preFilters = Ember.$.Callbacks();
    
    var authPrefilter = function(options) {
      if(!options.headers) {
        options.headers = {};
      }
      options.headers['Authorization'] = "Token "+token;
      return options;
    };

    var uploader = Ember.Uploader.create({
      url: ENV.APP.serviceURL + '/publications'
    });

    if (!Ember.isEmpty(files)) {
      Ember.$.ajaxPrefilter(preFilters.fire);
      preFilters.add(authPrefilter);      
      uploader.upload(files[0]).then (successHandler, errorHandler);
    }
  }).observes('files')
});
