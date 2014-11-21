import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['publications'],

  publicationType: function() {
    var pubType = "";
    var that = this;
    this.get('controllers.publications.model').forEach(function(item){
      var aspect = item.aspects.findBy('id', that.get('model.publication_type_id'));
      if (aspect) {
        pubType = item.publication_type_code + " - " + aspect.content_type;
      }
    });
    return pubType;
  }.property('model.publication_type_id')

});
