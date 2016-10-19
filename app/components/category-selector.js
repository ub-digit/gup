import Ember from 'ember';

export default Ember.Component.extend({

  isEditing: false,

  initComponent: Ember.on('init', function() {
    this.set('filterString', '');
  }),

  updateCategories: Ember.observer('filterString', function() {
    var that = this;

    this.store.find('category', {query: this.get('filterString')}).then(function(response){
      that.set('categories', response);
    },
    function(error){
      //console.log('error', error);
    }
    );
  }),

  actions: {
    removeSelectedCategory: function(id){
      this.get('categoryList').removeObject(id);
    },

    addSelectedCategory: function(id) {
      // Check if category already exists in list
      if (this.get('categoryList').indexOf(id) === -1){
        this.get('categoryList').pushObject(id);
      }

    },

    clearSearch: function() {
      this.set('filterString', '');
    }
  }
});
