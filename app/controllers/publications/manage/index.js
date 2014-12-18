import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['publications/manage'],
  sources: [{value:'pubmed', label:'PubMed'},
            {value:'gupea',  label:'GUPEA'},
            {value:'scopus', label:'Scopus'},
            {value:'libris', label:'Libris'}],
  sourceData: {}
});
