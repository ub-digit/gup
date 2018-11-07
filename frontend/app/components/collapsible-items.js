import Ember from 'ember';

export default Ember.Component.extend({
  items: Ember.A([]),
  activeItems: Ember.A([]),
  accordion: false,
  isActiveItem(item) {
    return this.get('activeItems').indexOf(item) !== -1;
  },
  itemStates: Ember.computed('items.[]', 'activeItems.[]', function() {
    return this.get('items').map((item) => {
      return Ember.Object.create({item: item, isActive: this.isActiveItem(item)});
    });
  }),
  actions: {
    toggleActiveItem(item) {
      if (this.get('accordion')) {
        this.get('activeItems').without(item).forEach((item) => {
          this.get('activeItems').removeObject(item);
        });
      }
      if (this.isActiveItem(item)) {
        this.get('activeItems').removeObject(item);
      }
      else {
        this.get('activeItems').pushObject(item);
      }
    }
  }
});
