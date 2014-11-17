import Ember from 'ember';

function formatDate(date) {
 	var tempDateObj = moment(date);
	return new Handlebars.SafeString(tempDateObj.format("YYYY-MM-DD HH:mm"));
}

export {
  formatDate
};

export default Ember.Handlebars.makeBoundHelper(formatDate);
