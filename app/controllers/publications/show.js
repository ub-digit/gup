import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['publications'],

  publicationType: function() {
    var pubType = this.get('controllers.publications.model').findBy('id', this.get('model.publication_type_id'));
    if (!pubType) {
      return '';
    }
    return pubType.publication_type_code + ' - ' + pubType.content_type;
  }.property('model.publication_type_id')

});
