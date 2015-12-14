import Ember from 'ember';

export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  isTypeList: Ember.computed.equal('type', 'list'),

  isTypeAuthors: Ember.computed.equal('type', 'authors'),

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
  })

});
