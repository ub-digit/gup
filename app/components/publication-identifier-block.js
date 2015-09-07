import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    deleteIdentifier: function(publicationIdentifier){
      this.get('publicationIdentifiers').removeObject(publicationIdentifier);
    },
    createIdentifier: function(code, value){
      var publicationIdentifier = {identifier_code: code, identifier_value: value};
      this.get('publicationIdentifiers').addObject(publicationIdentifier);
    }
  }
});
