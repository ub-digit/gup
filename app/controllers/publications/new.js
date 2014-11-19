import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['publications'],
  selectedPublicationType: 'book',
  selectedForm: 'book',
  model: {},

  formPartial: function() {
    return 'publications/publicationtypes/' + this.get('selectedForm');
  }.property('selectedForm'),
  
  selectedPublicationTypeAspects: function() {
    var pubType = this.get('controllers.publications.model').findBy('publication_type_code', this.get('selectedPublicationType'));
    if (!pubType)
    {
    	return null;
    }
    this.set('selectedForm', pubType.aspects[0].form_template);
    return pubType.aspects;
  }.property('selectedPublicationType')

});
