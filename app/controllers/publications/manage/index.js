import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    laddaupp: function() {
      Ember.$('#fulgrej').click();
    }
  },
  needs: ['publications/manage'],
  sources: [{value:'pubmed', label:'PubMed'},
            {value:'gupea',  label:'GUPEA'},
            {value:'scopus', label:'Scopus'},
            {value:'libris', label:'Libris'}],
  sourceData: {}
});
