import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['qp'],
  qp: '',
  query: '',

  actions: {
    sendQuery: function() {
      this.set('qp', this.get('query'));
    }
  }
});
