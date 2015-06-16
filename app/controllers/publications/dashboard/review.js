import Ember from 'ember';

export default Ember.Controller.extend({


  actions: {

    showMessage: function(type, msg) {

      this.send('setMsgHeader', type, msg);

    }

  }

});
