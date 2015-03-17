import Ember from 'ember';

export default Ember.Controller.extend({
	sources: [{value:'pubmed', label:'PubMed'},
	        {value:'gupea',  label:'GUPEA'},
	        {value:'scopus', label:'Scopus'},
	        {value:'libris', label:'Libris'}],
	selectedSource: null,


});
