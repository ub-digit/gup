import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    uploadFile: function() {
      Ember.$('#fileUploader').click();
    }
  }
});
