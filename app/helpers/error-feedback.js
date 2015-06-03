import Ember from 'ember';

export function errorFeedback(arr) {
	var str = '';
	arr.forEach(function(item) {
		str = str + item;
	});
	return new Ember.Handlebars.SafeString('<i class="fa fa-info-circle hand" data-toggle="popover" title="Felinformation" data-content="'+ str +'"></i>')
}

export default Ember.HTMLBars.makeBoundHelper(errorFeedback);
