import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  classNameBindings: ['isDifferent:compare-row-different'],
  isCollapsed: true,

  isDifferent: Ember.computed('fieldValue', 'otherFieldValue', 'type', 'otherIsSelected', 'listValueArray', 'listOtherValueArray', function() {
    var leftValue = this.get('fieldValue');
    var rightValue = this.get('otherFieldValue');
    var type = this.get('type');

    /* Ignore checks when other version is not yet selected */
    if(!this.get('otherIsSelected')) {
      return false;
    }

    /* Convert lists and authors into strings before comparison */
    if(type === 'authors') {
      leftValue = JSON.stringify(leftValue);
      rightValue = JSON.stringify(rightValue);
    }
    
    if(type === 'list') {
      leftValue = JSON.stringify(this.get('listValueArray'));
      rightValue = JSON.stringify(this.get('listOtherValueArray'));
    }

    console.log("isDifferent", leftValue, rightValue);
    
    if(leftValue !== rightValue) {
      return true;
    }

    return false;
  }),

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

  listOtherValueArray: Ember.computed('otherFieldValue', 'listLabel', 'listValue', function() {

    var listValue = this.get('listValue');
    var listLabel = this.get('listLabel');

    if(!this.get('otherFieldValue')) { return []; }
    
    return this.get('otherFieldValue').map(function(listItem) {
      if (listLabel) {
        return listItem[listLabel] + ': ' + listItem[listValue];
      } else {
        return listItem[listValue];
      }
    });
  }),

  collapsedValue: Ember.computed('fieldValue', function() {
    //var collapsedLength = 150;
    var thresholdLength = 200;
    var fieldValue = this.get('fieldValue');
    if (fieldValue && fieldValue.length > thresholdLength) {
      return fieldValue.substring(0, thresholdLength) + '...';
    } else {
      return null;
    }
  }),

  collapsedOtherValue: Ember.computed('otherFieldValue', function() {
    //var collapsedLength = 150;
    var thresholdLength = 200;
    var fieldValue = this.get('otherFieldValue');
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
