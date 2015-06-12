import Ember from 'ember';

export default Ember.Component.extend({


  bibliographicInfoString: Ember.computed('item.publication_type', function() {

    var i = this.get('item');
    var s = '';

    switch (this.get('item.publication_type')) {
      case 'journal-articles':
      case 'review-articles':
      case 'editorial-letters':
      case 'book-reviews':
      case 'magazine-articles':

        s += i.sourcetitle || '';
        s += i.sourcevolume ? ', (' + i.sourcevolume + ')' : '';
        s += i.sourceissue ? i.sourceissue : '';
        s += i.pubyear ? ', ' + i.pubyear : '';
        s += i.sourcepages ? ', ' + i.sourcepages : '';
        return s;
        break;

      case 'books':
      case 'translations':
      case 'doctoral-thesis':
      case 'reports':

        s += i.place || '';
        s += i.publisher ? ', ' + i.publisher : '';
        s += i.pubyear ? ', ' + i.pubyear : '';
        return s;
        break;

      case 'book-chapters':
      case 'conference-papers':
      case 'conference-contributions':

        s += i.sourcetitle || '';
        s += i.pubyear ? ', ' + i.pubyear : '';
        s += i.sourcepages ? ', ' + i.sourcepages : '';
        return s;
        break;
    }

  })

});
