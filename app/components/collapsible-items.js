import Ember from 'ember';

export default Ember.Component.extend({
  items: null,
  activeItems: Ember.A([]),
  itemIdKey: 'id',
  accordion: false,
  isActiveItem(item) {
    return this.get('activeItems').indexOf(item) !== -1;
  },
  itemIsActiveStates: Ember.Object.create({}), //Object or not?
  init() {
    this._super(...arguments);
    let rebuildItemIsActiveStates = () => {
      let activeStates = this.get('itemIsActiveStates');
      for (let item of this.get('items')) {
        activeStates.set(item.get(this.get('itemIdKey')).toString(), this.isActiveItem(item));
      }
    };
    let syncItemIsActiveStates = () => {
      // Remove items no longer present
      this.get('itemIsActiveStates').filter((_, itemId) => {
        return !this.get('items').findBy(this.get('itemIdKey'), itemId);
      })
      .forEach((_, removedItemId) => {
        this.set(removedItemId, undefined);
      });
      rebuildItemIsActiveStates();
    };

    // Set default values for active states
    rebuildItemIsActiveStates();

    // Add observers to sync active states
    this.addObserver('items.[]', syncItemIsActiveStates);
    this.addObserver('activeItems.[]', rebuildItemIsActiveStates);
  },

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
