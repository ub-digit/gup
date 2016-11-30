import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  isTypeLinks: Ember.computed.equal('type', 'links'),
  isTypeList: Ember.computed.equal('type', 'list'),
  isTypeAuthors: Ember.computed.equal('type', 'authors'),

  isTypeIdentifier: Ember.computed.equal('type', 'identifier'),
  getCorrectBaseURL: function(listItem, listLabel, listValue) {
    var baseURLS = {
      DOI: 'https://doi.org/',
      handle: 'http://hdl.handle.net/',
      libris: 'http://libris.kb.se/bib/',
      pubmed: 'https://www.ncbi.nlm.nih.gov/pubmed/'
    };

    var isPubmed = function(item) {
      if (item.indexOf('Pubmed-ID') !== -1) {
        return true;
      }
    }

    var isDOI =  function(item) {
      if (item.indexOf('DOI') !== -1) {
        return true;
      }
    }

    var isHandle =  function(item) {
      if (item.indexOf('Handle-ID') !== -1) {
        return true;
      }
    }

    var isLibris =  function(item) {
      if (item.indexOf('Libris-ID') !== -1) {
        return true
      }
    }

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
    var listValue = this.get('listValue');
    var listLabel = this.get('listLabel');

    if (this.get("isTypeIdentifier")) {
      var that = this;
      return this.get('fieldValue').map(function(listItem) {
        var baseURL = that.getCorrectBaseURL(listItem, listLabel, listValue);
        if (baseURL !== null) {
          return Ember.String.htmlSafe(listItem[listLabel] + ': ' + "<a href='"+baseURL + listItem[listValue] + "'>" + baseURL + listItem[listValue] + "</a>");
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
