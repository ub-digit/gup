import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  createNewItem: null,
  addItemText: null,
  deleteItemText: null,
  items: null,
  sortedItems: Ember.computed('items.@each.position', function() {
    return this.get('items').sortBy('position');
  }),
  //TODO: replace with Ember.Computed.(magick)
  hasMoreThanOneItem: Ember.computed('items.[]', function() {
    //TODO: double check, array length javscript weirdness etc
    return this.get('items').length > 1;
  }),
  init() {
    this._super(...arguments);
    if (Ember.isBlank(this.get('addItemText'))) {
      this.set('addItemText', this.get('i18n').t('components.multipleItems.addItemText'));
    }
    if (Ember.isBlank(this.get('deleteItemText'))) {
      this.set('deleteItemText', this.get('i18n').t('components.multipleItems.deleteItemText'));
    }
    //TODO: Perhaps should expect parent components to provide items as array?
    //this.attrs.items.update(this.get('items'));
    if (Ember.isEmpty(this.get('items'))) {
      this.set('items', Ember.A([]));
    }
    if (!this.get('items').length) {
      this.send('addItem');
    }
  },
  actions: {
    //didAddItem etc??
    addItem: function() {
      let newItem = this.get('createNewItem')();
      let lastItem = this.get('items').get('lastObject');
      newItem.set('position', lastItem !== undefined ? lastItem.get('position') + 1 : 0);
      this.get('items').pushObject(newItem);
    },
    removeItem: function(item) {
      this.get('items').removeObject(item);
    },
    didMoveItemUp: function(item) {
      let sortedItems = this.get('sortedItems');
      if (sortedItems.get('firstObject') !== item) {
        let idx = sortedItems.indexOf(item);
        let position = item.get('position');
        let itemAbove = sortedItems.objectAt(idx - 1);
        item.set('position', itemAbove.position);
        itemAbove.set('position', position);
      }
    },
    didMoveItemDown: function(item) {
      let sortedItems = this.get('sortedItems');
      if (sortedItems.get('lastObject') !== item) {
        let idx = sortedItems.indexOf(item);
        let position = item.get('position');
        let itemBelow = sortedItems.objectAt(idx + 1);
        item.set('position', itemBelow.position);
        itemBelow.set('position', position);
      }
    }
  }
});
