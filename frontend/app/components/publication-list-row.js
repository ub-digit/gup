import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  showMetaData: true,
  showMoreAuthors: false,
  allowToggleAuthors:  Ember.computed("item.authors", function() {
    if (this.get("item.authors").length > 10) {
      return true;
    }
    return false;
  }),

  hasOpenAccess: Ember.computed('item.open_access', function() {
    //TBD: re-enable when open access is properly implemented
    let oaLink = this.get('item.publication_links') ? this.get('item.publication_links').findBy('oa', true) : null;
    if (oaLink) {
      return true;
    }
    return false;

  }),

  titleString: Ember.computed('item.title', function() {
    return this.get('item.title') || this.get('i18n').t('components.publicationListRow.noTitle');
  }),

  isRef: Ember.computed('item.ref_value', function() {
    return this.get('item.ref_value') === 'ISREF';
  }),

  getLowercaseRefValue: Ember.computed('item.ref_value_label', function() {
    return this.get('item.ref_value_label').toLowerCase();
  }),


  bibliographicInfoString: Ember.computed('item.publication_type', function() {
    var i = this.get('item');
    var a = [];

    switch (this.get('item.publication_type')) {
      case 'publication_journal-article':
      case 'publication_review-article':
      case 'publication_editorial-letter':
      case 'publication_book-review':
      case 'publication_magazine-article':
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
      case 'publication_book':
      case 'publication_doctoral-thesis':
      case 'publication_report':
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
      case 'publication_book-chapter':
      case 'conference_paper':
      case 'conference_other':
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
  }),

  actions: {
    showAllAuthors: function() {
      this.set('showMoreAuthors', true);
    }
  }
});
