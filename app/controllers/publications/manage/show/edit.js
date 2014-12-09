import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['publications'],
  selectedPublicationType: null,
  selectedContentType: null,

  publicationTypeCodes: function(){
    
    var found = {};

    return this.get('controllers.publications.model').map(function(pubtype) {
      if (found[pubtype.publication_type_code]) {
        return null;
      }
      else {
        found[pubtype.publication_type_code] = true;
        return pubtype;
      }
    }).compact();

  }.property('controllers.publications.model'),

  formPartial: function() {
  	this.set('model.publication_type_id', this.get('selectedContentType'));
    var contentType = this.get('controllers.publications.model').findBy('id', this.get('selectedContentType') || 0);    
    return 'publications/publicationtypes/' + contentType.form_template;
  }.property('selectedPublicationType', 'selectedContentType'),
  
  contentTypes: function() {
    return this.get('controllers.publications.model').filterBy('publication_type_code', this.get('selectedPublicationType'));
  }.property('selectedPublicationType', 'controllers.publications.model'),
 
  setDefaultContentType: function() {
    var contentType = this.get('controllers.publications.model').findBy('publication_type_code', this.get('selectedPublicationType'));    
    this.set('selectedContentType', contentType.id);
  }.observes('selectedPublicationType')
});
