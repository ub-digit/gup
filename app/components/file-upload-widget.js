import Ember from 'ember';

export default Ember.Component.extend({
	isEmbargo: false,
	isAccepted: false,
	gupEmbargoDate: Date(),

	refreshModelAction: 'refreshModel',
	setMsgHeader: 'setMsgHeader',

	didInsertElement: function() {
		this._super();
		var that = this;
		Ember.$('#fileUploadModal').on('show.bs.modal', function (e) {
	    	that.set("gupEmbargoDate", Date());
	    	that.set("isEmbargo", false);
	    	that.set("isAccepted", false);
	    	that.set("hasError", false);
		});

	    Ember.$('#fileUploadModal').on('hide.bs.modal', function (e) {
	    	that.set("fileUploadProgress", 0);
	    	Ember.$("#gup-progress-bar").hide();
	    	
	    });
	},

	actions: {
		saveModel: function () {
			var that = this;
			var generalCallback = function(model) {
				if (model.error) {
					that.set("hasError", "Du måste godkänna avtalet nedan");
				}
				else {
					that.sendAction("refreshModelAction", that.get("publication.id"));
					Ember.$('#fileUploadModal').modal('hide');
					that.sendAction("setMsgHeader", 'success', 'Filen sparades');
				}
			}
			var model = this.get("assetData");
			if (this.get("isEmbargo")) {
				this.set("assetData.visible_after", this.get("gupEmbargoDate"));
			}
			else {
				this.set("assetData.visible_after", null);
			}	
			this.set("assetData.accepted", this.get("isAccepted"));
			this.store.save('asset_data', this.get("assetData")).then(generalCallback);
		}
	}
});
