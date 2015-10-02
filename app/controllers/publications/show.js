import Ember from 'ember';

export default Ember.Controller.extend({
  publications: Ember.inject.controller(),
  application: Ember.inject.controller(),

  viewModeBinding: 'application.viewMode',
  publicationType: function() {
    var pubType = this.get('publications.model').findBy('id', this.get('model.publication_type_id'));
    if (!pubType) {
      return '';
    }
    return pubType.publication_type_code + ' - ' + pubType.content_type;
  }.property('model.publication_type_id')

});
