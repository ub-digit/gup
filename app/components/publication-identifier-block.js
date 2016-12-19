import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    deleteIdentifier: function(publicationIdentifier){
      this.get('publicationIdentifiers').removeObject(publicationIdentifier);
    },
    createIdentifier: function(code, value){
      var label = this.get('publicationIdentifierCodes').findBy('code', code).label;
      var publicationIdentifier = {identifier_code: code, identifier_value: value, identifier_label: label};
      this.get('publicationIdentifiers').addObject(publicationIdentifier);
      this.set('identifierCode', null);
      this.set('identifierValue', '');
    }
  }
});
