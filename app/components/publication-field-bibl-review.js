import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  isCollapsed: true,

  isTypeList: Ember.computed.equal('type', 'list'),

  isTypeAuthors: Ember.computed.equal('type', 'authors'),

  isTypeCollapsible: Ember.computed.equal('type', 'collapsed'),

  listValueArray: Ember.computed('fieldValue', 'listLabel', 'listValue', function() {

    var listValue = this.get('listValue');
    var listLabel = this.get('listLabel');

    return this.get('fieldValue').map(function(listItem) {
      if (listLabel) {
        return listItem[listLabel] + ': ' + listItem[listValue];
      } else {
        return listItem[listValue];
      }
    });
  }),

  collapsedValue: Ember.computed('fieldValue', function() {
    var collapsedLength = 150;
    var thresholdLength = 200;
    var fieldValue = this.get('fieldValue');
    if (fieldValue && fieldValue.length > thresholdLength) {
      return fieldValue.substring(0, thresholdLength) + '...';
    } else {
      return null;
    }
  }),

  actions: {
    toggleCollapsed: function() {
      this.toggleProperty('isCollapsed');
    }
  }

});
