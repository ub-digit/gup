import Ember from 'ember';

function formatDate(params) {
  var date = params[0];
  var format = params[1] || "YYYY-MM-DD HH:mm";
 	var tempDateObj = moment(date);
	return new Ember.Handlebars.SafeString(tempDateObj.format(format));
}

export {
  formatDate
};

export default Ember.Helper.helper(formatDate);
