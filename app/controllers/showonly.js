import Ember from 'ember';

export default Ember.Controller.extend({  
  allFieldObjects: Ember.computed('publicationType.all_fields', function( ) {
    var o = Ember.Object.create();
    if (this.get('publicationType.all_fields')) {
      this.get('publicationType.all_fields').forEach(function(field) {
        Ember.set(o, field.name, field);
      });
    } 
    return o;
  }),

  getPublicationTypeObject: Ember.computed('publicationTypes', function() {
    let fullObjectPubtype = this.get('publicationTypes').findBy('code', this.get('selectedPublicationType'));
    return fullObjectPubtype;
  }),

  publicationType: Ember.computed('publication.publication_type', function(){
    return this.get("publicationTypes").findBy("id", this.get("publication.publication_type_id"));
  }),

});
