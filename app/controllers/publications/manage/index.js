import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    uploadFile: function() {
      Ember.$('#fileUploader').click();
    }
  },
  needs: ['publications/manage'],
  sources: [{value:'pubmed', label:'PubMed'},
            {value:'gupea',  label:'GUPEA'},
            {value:'scopus', label:'Scopus'},
            {value:'libris', label:'Libris'}],
  sourceData: {}
});
