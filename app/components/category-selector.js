import Ember from 'ember';

export default Ember.Component.extend({

  initComponent: Ember.on('init', function(){
    this.set('filterString', '');
  }),

  updateCategories: Ember.observer('filterString', function(){
    var that = this;
    this.store.find('category', {query: this.get('filterString')}).then(function(response){
      that.set('categories', response);
    },
    function(error){
      console.log('error', error);
    }
  );
}),

actions: {
  removeSelectedCategory: function(categoryId){
    this.get('value').removeObject(categoryId);
  }
}
});
