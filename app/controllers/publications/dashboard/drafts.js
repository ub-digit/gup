import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {

    delete: function(id) {

      var that = this;

      this.store.destroy('publication', id).then(function() {

        that.send('refreshModel');

      },
      function() {

        

      }

    );


  }

}
});
