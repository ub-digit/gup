import Ember from 'ember';

export default Ember.Controller.extend({

  approvePublication: function(id) {



  },

  actions: {
    approve: function(id) {
      confirm('Vill du godkänna denne ' + id);
    }
  }
});
