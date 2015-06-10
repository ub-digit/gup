import Ember from 'ember';

export default Ember.Component.extend({

  expanded: false,
  addSelectedCategoryString: 'addSelectedCategory',
  isExpanded: Ember.computed.equal('expanded', true),

  isSelected: Ember.computed('categoryList.@each', 'category.svepid', function() {

    return !(this.get('categoryList').indexOf(this.get('category.svepid')) === -1);

  }),

  actions: {
    toggle: function() {
      this.toggleProperty('expanded');
    },

    addSelectedCategory: function(id) {

      this.sendAction('addSelectedCategoryString', id);

    }
  }
});
