import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
	session: Ember.inject.service('session'),
	fileBaseUrl: ENV.APP.fileURL, 

	init: function() {
		this._super();
		this.set("token", this.get("session.data.authenticated.token"));
	},

	refreshModelAction: 'refreshModel',
	setMsgHeaderAction: 'setMsgHeader',

	actions: {
		removeFile: function(id) {
			var that = this;
			var successHandler = function() {

			}

			var errorHandler = function() {

			}
			var generalHandler = function(model) {
				//alert("this was generalHandler");
				that.sendAction("refreshModelAction", that.get("publication.id"));
				that.sendAction("setMsgHeaderAction", 'success', 'Filen har tagits bort');
			};


 			var result = window.confirm('Är du säker på att du vill ta bort filen?');
			if (result == false) {
				return;
            }
            else {
            	// delete file
            	this.store.destroy('asset_data',id).then(generalHandler);
            }
		}
	}
});
