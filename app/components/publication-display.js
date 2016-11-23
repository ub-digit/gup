import Ember from 'ember';


export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  classNames: ['publication-display'],
  classNameBindings: ['isReviewMode:publication-review-list', 'isPreviewMode:publication-preview-list'],
  isReviewMode: Ember.computed.equal('mode', 'review'),
  isPreviewMode: Ember.computed.equal('mode', 'preview'),
  isCompareMode: Ember.computed.equal('mode', 'compare'),

  getCodeForPublicationType: function(id) {
    var publicationType = this.get("allPublicationTypes").findBy("id", id);
    return publicationType.code;
  },


  getBaseUrlForIdentifier: Ember.computed('publication.publication_identifiers', function() {
    var arr = this.get("publication.publication_identifiers");
    var baseDOI = 'https://doi.org/';
    var handle = 'http://hdl.handle.net/';
    var libris = 'http://libris.kb.se/bib/';
    var pubmed = 'https://www.ncbi.nlm.nih.gov/pubmed/';
    return "baseUrl";
  }), 

  isPatent: Ember.computed('publication.publication_type', function() {
    var code = this.getCodeForPublicationType(this.get("publication.publication_type_id"));
    let arr = Ember.A(['intellectual-property_patent']);
    return arr.indexOf(code) !== -1;
  }),

  isArt: Ember.computed('publication.publication_type', function() {
    var code = this.getCodeForPublicationType(this.get("publication.publication_type_id"));
    let arr = Ember.A(['artistic-work_scientific_and_development','artistic-work_original-creative-work']);
    return arr.indexOf(code) !== -1;
  }),

  isArticleConf: Ember.computed('publication.publication_type', function() {
    var code = this.getCodeForPublicationType(this.get("publication.publication_type_id"));
    let arr = Ember.A(['publication_journal-article','publication_review-article', 'publication_editorial-letter','publication_book-review','publication_magazine-article', 'publication_newspaper-article', 'conference_paper', 'conference_poster','conference_other', 'publication_journal-issue', 'publication_encyclopedia-entry','other']);
    return arr.indexOf(code) !== -1;
  }),

  isThesis: Ember.computed('publication.publication_type', function() {
    var code = this.getCodeForPublicationType(this.get("publication.publication_type_id"));
    let arr = Ember.A(['publication_doctoral-thesis','publication_licentiate-thesis']);
    return arr.indexOf(code) !== -1;
  }),

  isBook: Ember.computed('publication.publication_type', function() {
    var code = this.getCodeForPublicationType(this.get("publication.publication_type_id"));
    let arr = Ember.A(['publication_book','publication_textbook', 'publication_textcritical-edition', 'publication_report', 'publication_edited-book', 'conference_proceeding', 'publication_working-paper']);
    return arr.indexOf(code) !== -1;
  }),

  isChapter: Ember.computed('publication.publication_type', function() {
    var code = this.getCodeForPublicationType(this.get("publication.publication_type_id"));
    let arr = Ember.A(['publication_book-chapter','publication_report-chapter']);
    return arr.indexOf(code) !== -1;
  }),


  hasRefValue: Ember.computed('publication.ref_value', function() {
    if (this.get("publication.ref_value") == "NA") {
      return false;
    }
    return true;
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
      this.sendAction("setMessageAction", 'success', 'Filen har tagits bort'); //@FIXME: translation
    },
    refreshModel: function() {
      this.sendAction('refreshModelAction', this.get('publication.id'));
    },
    fetchVersion: function(version_id) {
      this.sendAction('fetchVersionString', this.get('publication.id'), version_id);
    }
  }
});
