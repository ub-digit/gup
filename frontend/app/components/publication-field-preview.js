import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  isTypeLinks: Ember.computed.equal('type', 'links'),
  isTypeList: Ember.computed.equal('type', 'list'),
  isTypeAuthors: Ember.computed.equal('type', 'authors'),

  isTypeIdentifier: Ember.computed.equal('type', 'identifier'),
  getCorrectBaseURL: function(listItem, listLabel) {
    let baseURLS = {
      DOI: 'https://doi.org/',
      handle: 'http://hdl.handle.net/',
      libris: 'http://libris.kb.se/bib/',
      pubmed: 'https://www.ncbi.nlm.nih.gov/pubmed/'
    };

    let isPubmed = function(item) {
      return item.indexOf('Pubmed-ID') !== -1;
    };
    let isDOI = function(item) {
      return item.indexOf('DOI') !== -1;
    };
    let isHandle = function(item) {
      return item.indexOf('Handle-ID') !== -1;
    };
    let isLibris = function(item) {
      return item.indexOf('Libris-ID') !== -1;
    };

    if (isPubmed(listItem[listLabel])) {
      return baseURLS.pubmed;
    }
    if (isDOI(listItem[listLabel])) {
      return baseURLS.DOI;
    }
    if (isHandle(listItem[listLabel])) {
      return baseURLS.handle;
    }
    if (isLibris(listItem[listLabel])) {
      return baseURLS.libris;
    }
    return null;
  },

  listValueArray: Ember.computed('fieldValue', 'listLabel', 'listValue', function() {
    let listValue = this.get('listValue');
    let listLabel = this.get('listLabel');

    if (this.get('isTypeIdentifier')) {
      var that = this;
      return this.get('fieldValue').map(function(listItem) {
        var baseURL = that.getCorrectBaseURL(listItem, listLabel);
        if (baseURL !== null) {
          return Ember.String.htmlSafe(listItem[listLabel] + ': ' + "<a target='_blank' href='"+baseURL + listItem[listValue] + "'>" + baseURL + listItem[listValue] + "</a>");
        }
        else {
          return listItem[listLabel] + ': ' + listItem[listValue];
        }
      });
    }
    else {
      return this.get('fieldValue').map(function(listItem) {
        if (listLabel) {
          return listItem[listLabel] + ': ' + listItem[listValue];
        } else {
          return listItem[listValue];
        }
      });
    }
  }),
});
