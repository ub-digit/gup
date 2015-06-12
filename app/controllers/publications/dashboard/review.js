import Ember from 'ember';

export default Ember.Controller.extend({

  approvePublication: function(id) {



  },

  actions: {
    approve: function(item) {
      var that = this;
      //confirm('Vill du godkänna denne ' + id);
      this.store.find('publication', item.db_id + '/review').then(function(response){
      },
      function(reason){
      });
    }
  }
});
