import Ember from 'ember';

export function isSaveNewAuthorBtnDisabled(authorForm) {
	if ((authorForm.get("firstName") !== '') && (authorForm.get("lastName") !== '')) {
		return true;
	}
	else {
		return false;
	}
}

export default Ember.Handlebars.makeBoundHelper(isSaveNewAuthorBtnDisabled);
