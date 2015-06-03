import Ember from 'ember';

export default Ember.Controller.extend({

  isError: Ember.computed.equal('msgType', 'error')

});
