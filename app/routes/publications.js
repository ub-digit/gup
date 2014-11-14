import Ember from 'ember';

export default Ember.Route.extend({
  model: function()
  {
    //return [{pubType: 'article', pubTypeLabel: 'Artikel'}, {pubType: 'book', pubTypeLabel: 'Bok'}]; 
    return this.store.find('publication_type'); 
  }
});
