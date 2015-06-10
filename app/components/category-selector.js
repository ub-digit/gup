import Ember from 'ember';

export default Ember.Component.extend({

  MAX_NUMBER_OF_CATEGORIES: 3,
  isEditing: false,

  initComponent: Ember.on('init', function(){
    this.set('filterString', '');
  }),


  numberLeft: Ember.computed('categoryList.@each', function() {
    return this.get('MAX_NUMBER_OF_CATEGORIES') - this.get('categoryList.length');
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
      this.get('categoryList').removeObject(categoryId);
    },

    addSelectedCategory: function(id) {

      // Check if category already exists in list, and that maximum value is not reached
      if (this.get('categoryList').indexOf(id) === -1 && this.get('categoryList.length') < this.get('MAX_NUMBER_OF_CATEGORIES')){
        this.get('categoryList').pushObject(id);
      }
    },

    openEdit: function() {
      this.set('isEditing', true);
    },

    closeEdit: function() {
      this.set('isEditing', false);
    }
  }

});
