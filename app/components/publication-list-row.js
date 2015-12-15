import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  showMetaData: true,

  titleString: Ember.computed('item.title', function() {

    return this.get('item.title') || this.get('i18n').t('publication.labels.noTitle');

  }),

  bibliographicInfoString: Ember.computed('item.publication_type', function() {

    var i = this.get('item');
    var a = [];

    switch (this.get('item.publication_type')) {
      case 'journal-articles':
      case 'review-articles':
      case 'editorial-letters':
      case 'book-reviews':
      case 'magazine-articles':

        if (i.sourcetitle) {
          a.push(i.sourcetitle);
        }
        if (i.sourcevolume) {
          a.push('(' + i.sourcevolume + ')' + i.sourceissue);
        }
        if (i.pubyear) {
          a.push(i.pubyear);
        }
        if (i.sourcepages) {
          a.push(i.sourcepages);
        }

        break;

      case 'books':
      case 'translations':
      case 'doctoral-thesis':
      case 'reports':

        if (i.place) {
          a.push(i.place);
        }
        if (i.publisher) {
          a.push(i.publisher);
        }
        if (i.pubyear) {
          a.push(i.pubyear);
        }

        break;

      case 'book-chapters':
      case 'conference-papers':
      case 'conference-contributions':

        if (i.sourcetitle) {
          a.push(i.sourcetitle);
        }
        if (i.pubyear) {
          a.push(i.pubyear);
        }
        if (i.sourcepages) {
          a.push(i.sourcepages);
        }
        break;
    }
    return a.join(', ');

  })

});
