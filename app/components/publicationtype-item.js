import Ember from 'ember';

export default Ember.Component.extend({
  publicationType: Ember.computed('code', 'publicationTypes', function(){
    return this.get('publicationTypes').findBy('code', this.get('code'));
  }),

  setPublicationTypeAction: 'setPublicationType',

  actions: {
    setPublicationType: function(){
      this.sendAction('setPublicationTypeAction', this.get('code'));
    }
  }
});
