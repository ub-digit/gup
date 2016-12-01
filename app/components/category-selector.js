import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  error: null,

  initComponent: Ember.on('init', function() {
    this.set('filterString', '');
  }),

  updateCategories: Ember.observer('filterString', function() {
    this.store.find('category', {query: this.get('filterString')}).then((response) => {
      this.set('categories', response);
    },
    (error) => {
      this.set('error', error.error.msg);
    }
    );
  }),

  actions: {
    removeSelectedCategory: function(id) {
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
