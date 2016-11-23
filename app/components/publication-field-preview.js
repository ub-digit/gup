import Ember from 'ember';

export default Ember.Component.extend({

  i18n: Ember.inject.service(),
  
  isTypeLinks: Ember.computed.equal('type', 'links'),

  isTypeList: Ember.computed.equal('type', 'list'),

  isTypeAuthors: Ember.computed.equal('type', 'authors'),

  isTypeIdentifier: Ember.computed.equal('type', 'identifier'),


  listValueArray: Ember.computed('fieldValue', 'listLabel', 'listValue', function() {

    var listValue = this.get('listValue');
    var listLabel = this.get('listLabel');


    if (this.get("isTypeIdentifier")) {

      return this.get('fieldValue').map(function(listItem) {
          var getCorrectBaseURL = function(listItem) { 
            var baseURLS = {DOI:'https://doi.org/', handle: 'http://hdl.handle.net/', 
                                libris: 'http://libris.kb.se/bib/', pubmed: 'https://www.ncbi.nlm.nih.gov/pubmed/' }

            var isPubmed = function(item) {
              if (item.indexOf('Pubmed-ID') !== -1) {
                return baseURLS.pubmed;
              }
            }

            var isDOI =  function(item) {
              if (item.indexOf('DOI') !== -1) {
                return baseURLS.DOI;
              }
            }

            var isHandle =  function(item) {
              if (item.indexOf('Handle-ID') !== -1) {
                return baseURLS.handle;
              }
            }

            var isLibris =  function(item) {
              if (item.indexOf('Libris-ID') !== -1) {
                return baseURLS.libris
              }
            }

            if (isPubmed(listItem)) {
              return baseURLS.pubmed + listItem;
            }
            if (isDOI(listItem)) {
              return baseURLS.DOI + listItem;
            }
            if (isHandle(listItem)) {
              return baseURLS.Handle + listItem;
            }

            if (isLibris(listItem)) {
              return baseURLS.libris + listItem;
            }

            return null;
          } 
          if (getCorrectBaseURL(listItem[listLabel]) !== null) {
            return Ember.String.htmlSafe(listItem[listLabel] + ': ' + "<a href='"+getCorrectBaseURL(listItem[listLabel]) + listItem[listValue] + "'>" + getCorrectBaseURL(listItem[listLabel]) + listItem[listValue] + "</a>");
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

  listValueIdentifierArray: Ember.computed.equal('fieldValue', 'listLabel', 'listValue', function() {
    var arr = this.get("fieldValue");
    /// update with urls if possible
    var test = "test";
  }),

});
