import Ember from 'ember';

export default Ember.Controller.extend({

  deletePublication: function(id) {
    var that = this;
    this.store.destroy('publication', id).then(function() {
      that.send('refreshModel');
    });
  },
  actions: {
    delete: function(id) {
      var txt;
      var r = confirm("Är du verkligen riktigt säker på detta?");
      if (r == true) {
        this.deletePublication(id);
      } 
    }
  }
});
