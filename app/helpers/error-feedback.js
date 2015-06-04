import Ember from 'ember';

export function errorFeedback(arr) {
	var str = '<ul>';
	arr.forEach(function(item) {
		str = str + '<li>' + item + '</li>';
	});
	str = str + "</ul>";
	return new Ember.Handlebars.SafeString('<i class="popovers fa fa-info-circle hand" data-toggle="popover" title="Felinformation" data-content="<b>'+ str +'</b>"></i>')
}

export default Ember.HTMLBars.makeBoundHelper(errorFeedback);
