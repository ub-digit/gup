import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  classNames: ['publication-display'],
  classNameBindings: ['isReviewMode:publication-review-list', 'isPreviewMode:publication-preview-list'],
  isReviewMode: Ember.computed.equal('mode', 'review'),
  isPreviewMode: Ember.computed.equal('mode', 'preview'),
  isCompareMode: Ember.computed.equal('mode', 'compare'),

  getCodeForPublicationType: function(id) {
    var publicationType = this.get('allPublicationTypes').findBy('id', id);
    return publicationType.code;
  },

  getLowercaseRefValue: Ember.computed('publication.ref_value_label', function() {
    return this.get('publication.ref_value_label').toLowerCase();
  }),

  getBaseUrlForIdentifier: Ember.computed('publication.publication_identifiers', function() {
    //@ TODO: ??:
    /*
       let arr = this.get('publication.publication_identifiers');
       let baseDOI = 'https://doi.org/';
       let handle = 'http://hdl.handle.net/';
       let libris = 'http://libris.kb.se/bib/';
       let pubmed = 'https://www.ncbi.nlm.nih.gov/pubmed/';
       */
    return "baseUrl";
  }),

  getPublishedInStr: Ember.computed('publication.id', function(){
    let arr = [];
    arr.push(this.get("publication.sourcetitle"));
    let sourceissue_str = null;
    if (this.get("publication.sourceissue")) {
      sourceissue_str = " (" + this.get("publication.sourceissue") + ")"
    }
    let sourceissue_and_pages_str = this.get("publication.sourcevolume") + sourceissue_str;
    arr.push(sourceissue_and_pages_str);
    arr.push(this.get("publication.sourcepages"));
    arr.push(this.get("publication.article_number"));
    return arr.compact().join(', ');
  }),

  isPatent: Ember.computed('publication.publication_type', function() {
    let code = this.getCodeForPublicationType(this.get("publication.publication_type_id"));
    let arr = Ember.A(['intellectual-property_patent']);
    return arr.indexOf(code) !== -1;
  }),

  isArt: Ember.computed('publication.publication_type', function() {
    var code = this.getCodeForPublicationType(this.get("publication.publication_type_id"));
    let arr = Ember.A(['artistic-work_scientific_and_development','artistic-work_original-creative-work']);
    return arr.indexOf(code) !== -1;
  }),

  isArticleConf: Ember.computed('publication.publication_type', function() {
    var code = this.getCodeForPublicationType(this.get('publication.publication_type_id'));
    let arr = Ember.A(['publication_journal-article','publication_review-article', 'publication_editorial-letter','publication_book-review','publication_magazine-article', 'publication_newspaper-article', 'conference_paper', 'conference_poster','conference_other', 'publication_journal-issue', 'publication_encyclopedia-entry','other']);
    return arr.indexOf(code) !== -1;
  }),

  isThesis: Ember.computed('publication.publication_type', function() {
    var code = this.getCodeForPublicationType(this.get('publication.publication_type_id'));
    let arr = Ember.A(['publication_doctoral-thesis','publication_licentiate-thesis']);
    return arr.indexOf(code) !== -1;
  }),

  isBook: Ember.computed('publication.publication_type', function() {
    var code = this.getCodeForPublicationType(this.get('publication.publication_type_id'));
    let arr = Ember.A(['publication_book','publication_textbook', 'publication_textcritical-edition', 'publication_report', 'publication_edited-book', 'conference_proceeding', 'publication_working-paper']);
    return arr.indexOf(code) !== -1;
  }),

  isChapter: Ember.computed('publication.publication_type', function() {
    var code = this.getCodeForPublicationType(this.get('publication.publication_type_id'));
    let arr = Ember.A(['publication_book-chapter','publication_report-chapter']);
    return arr.indexOf(code) !== -1;
  }),

  isRef: Ember.computed('publication.ref_value', function() {
    return this.get('publication.ref_value') === 'ISREF';
  }),

  allFieldObjects: Ember.computed('publicationType.all_fields', function( ) {
    var o = Ember.Object.create();
    if (this.get('publicationType.all_fields')) {
      this.get('publicationType.all_fields').forEach(function(field) {
        Ember.set(o, field.name, field);
      });
    }
    return o;
  }),
  comparableVersions: Ember.computed('publication.versions', function() {
    var versions = this.get('publication.versions').slice(1);
    return versions.map(function(item,i) {
      return {index: (versions.length - i), item: item};
    });
  }),
  fetchVersionString: 'fetchVersion',

  refreshModelAction: 'refreshModel',

  setMessageAction: 'setMsgHeader',

  actions: {
    setMessage: function() {
      this.sendAction('refreshModelAction', this.get('publication.id'));
      this.sendAction('setMessageAction', 'success', 'Filen har tagits bort'); //@FIXME: translation
    },
    refreshModel: function() {
      this.sendAction('refreshModelAction', this.get('publication.id'));
    },
    fetchVersion: function(version_id) {
      this.sendAction('fetchVersionString', this.get('publication.id'), version_id);
    }
  }
});
