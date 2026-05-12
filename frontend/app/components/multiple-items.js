import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  createNewItem: null,
  addItemText: null,
  deleteItemText: null,
  items: null,
  totalNumberOfItems: Ember.computed('items.[]', function() {
    //TODO: double check, array length javscript weirdness etc
    return this.get('items').length;
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
    //  let lastItem = this.get('items').get('lastObject');
  //    newItem.set('position', lastItem !== undefined ? lastItem.get('position') + 1 : 0);
      this.get('items').pushObject(newItem);
    },
    removeItem: function(item) {
      this.get('items').removeObject(item);
    },
    didMoveItemUp: function(item) {
      let index = this.get("items").indexOf(item);
      if (index > 0) {
        this.get("items").removeAt(index);
        this.get("items").insertAt(index - 1, item);
      } 
    },
    didMoveItemDown: function(item) {
      let index = this.get("items").indexOf(item);
      if (index < this.get("items").length - 1) {
        this.get("items").removeAt(index);
        this.get("items").insertAt(index + 1, item);
      } 
    }
  }
});
