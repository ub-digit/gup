import Ember from 'ember';

export default Ember.Component.extend({

  expanded: false,
  addSelectedCategoryString: 'addSelectedCategory',
  removeSelectedCategoryString: 'removeSelectedCategory',
  isExpanded: Ember.computed.equal('expanded', true),


  initComponent: Ember.on('init', function(){
    console.log(this.get('category'));
  }),


  isSelected: Ember.computed('categoryList.@each', 'category.svepid', function() {

    return !(this.get('categoryList').indexOf(this.get('category.svepid')) === -1);

  }),

  actions: {
    toggle: function() {
      this.toggleProperty('expanded');
    },

    addSelectedCategory: function(id) {
      this.sendAction('addSelectedCategoryString', id);
    },

    removeSelectedCategory: function(id){
      this.sendAction('removeSelectedCategoryString', id);
    }
  }
});
