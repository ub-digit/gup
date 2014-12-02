import Ember from 'ember';

export default Ember.Controller.extend({
  sources: [{value:1, label:'PubMed'},{value:2, label:'Scopus'},{value:3, label:'WoS'}],
  sourceData: {},
  actions:{
    import: function(sourceData){
      console.log(sourceData)
    }
  }
});
