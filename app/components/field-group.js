import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['field-group'],
  hasContent: false,
  contentFields: [],
  init: function() {
    this.set('contentFields', []);
    this._super(arguments);
  },
  actions: {
    countContent: function(field_name) {
      this.set('hasContent', true);
      this.get('contentFields').push(field_name);
    }
  }
});
