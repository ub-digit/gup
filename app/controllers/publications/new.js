import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['publications'],
  selectedName: 'book',
  model: {},
  formPartial: function() {
  	console.log('DEBUG', this.get('selectedName'));
    return 'publications/publicationtypes/' + this.get('selectedName');
  }.property('selectedName')

});
