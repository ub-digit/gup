import Ember from 'ember';

export default Ember.Component.extend({
  MAX_NUMBER_OF_CATEGORIES: 3,
  expanded: false,
  addSelectedCategoryString: 'addSelectedCategory',
  isExpanded: Ember.computed.equal('expanded', true),

  actions: {
    toggle: function() {
      this.toggleProperty('expanded');
    },
    setCategory: function() {
      var that = this;
      var id = this.get('category.svepid');
      // Check if category already exists in list, and that maximum value is not reached
      if (that.get('categoryList').indexOf(id) === -1 && that.get('categoryList.length') < that.get('MAX_NUMBER_OF_CATEGORIES')){
        that.get('categoryList').pushObject(that.get('category.svepid'));
      }
    }
  }
});
