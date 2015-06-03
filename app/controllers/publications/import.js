import Ember from 'ember';

export default Ember.Controller.extend({
	sources: [{value:'pubmed', label:'PubMed'},
	        {value:'gupea',  label:'GUPEA'},
	        {value:'scopus', label:'Scopus'},
	        {value:'libris', label:'Libris'}],
	selectedSource: null,
	sourceId: null,

	btnIsActive: function() {
		if (this.get("selectedSource") && this.get('sourceId')) {
			return true;
		}
		else {
			return false;
		}
	}.property('selectedSource', 'sourceId'),


});
