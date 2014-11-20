import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['publications'],
  selectedPublicationType: 'article',
  selectedAspect: 'article-ref',

  formPartial: function() {
  	this.set('model.publication_type_id', this.get('selectedAspect.id'));
    return 'publications/publicationtypes/' + this.get('selectedAspect.form_template');
  }.property('selectedAspect'),
  
  selectedPublicationTypeAspects: function() {
    var pubType = this.get('controllers.publications.model').findBy('publication_type_code', this.get('selectedPublicationType'));
    if (!pubType)
    {
    	return null;
    }
    this.set('selectedAspect', pubType.aspects[0]);
    return pubType.aspects;
  }.property('selectedPublicationType')

});
