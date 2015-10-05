import Ember from 'ember';

function formatDate(params) {
  var date = params[0];
 	var tempDateObj = moment(date);
	return new Ember.Handlebars.SafeString(tempDateObj.format("YYYY-MM-DD HH:mm"));
}

export {
  formatDate
};

export default Ember.Helper.helper(formatDate);
