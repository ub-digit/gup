import Ember from 'ember';

export default Ember.Controller.extend({
  importDataBaseUrl: "todo",
  actions: {
    didUploadImportDataFile: function(response) {
      if('import_data' in response) {
        this.set('importData', response.asset_data);
      }
    },
    importDataFileUploadDidErr: function(errorResponse) {
      this.set('importData', null);
    },
    didSaveImportData: function(success, error) {
      this.store.save('import_data', this.get('importData')).then((model) => {
        //Is there a case when 200 will produce error in asset_data controller, don't think so
        //TODO: can remove this?
        if (model.error) {
          error(model.error.msg);
        }
        else {
          this.send('setMsgHeader', 'success', 'Filen sparades'); //TODO: Translate
          this.send('refreshModel');
          success();
        }
      }, (errorResponse) => {
        if(errorResponse.error) {
          error(errorResponse.error.msg);
        }
        else {
          //TODO: Handle backend crash error!
        }
      });
    },
    didCancelImportData: function() {
      this.set('importData', undefined);
    }
  }
});
