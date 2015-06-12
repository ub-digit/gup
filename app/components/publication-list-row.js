import Ember from 'ember';

export default Ember.Component.extend({

  showSourceTitle: Ember.computed('item.publication_type', function() {

    var t = this.get('item.publication_type');
    return !(t === 'books' || t === 'translations' || t === 'reports');

  }),

  showIssue: Ember.computed('item.publication_type', function() {

    var t = this.get('item.publication_type');
    return (t === 'journal-articles' || t === 'review-articles' || t === 'editorial-letters' || t === 'book-reviews' || t === 'magazine-articles');

  }),

  showPages: Ember.computed('item.publication_type', function() {

    var t = this.get('item.publication_type');
    return !(t === 'books' || t === 'translations' || t === 'reports');

  }),

  showPlace: Ember.computed('item.publication_type', function() {

    var t = this.get('item.publication_type');
    return (t === 'books' || t === 'translations' || t === 'reports');

  }),

  showPublisher: Ember.computed('item.publication_type', function() {

    var t = this.get('item.publication_type');
    return (t === 'books' || t === 'translations' || t === 'reports');

  })

});
