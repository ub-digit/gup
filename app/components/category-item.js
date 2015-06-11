import Ember from 'ember';

export default Ember.Component.extend({

  expanded: false,
  addSelectedCategoryString: 'addSelectedCategory',
  removeSelectedCategoryString: 'removeSelectedCategory',
  isExpanded: Ember.computed.equal('expanded', true),

  isSelected: Ember.computed('categoryList.@each', 'category.svepid', function() {
    return !(this.get('categoryList').indexOf(this.get('category.svepid')) === -1);
  }),

  isRoot: Ember.computed.equal('category.node_type', 'root'),

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
