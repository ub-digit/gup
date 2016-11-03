import Ember from 'ember';

export default Ember.Controller.extend({
  importDataBaseUrl: "todo",
  uploadImportDataFile: null,
  importDataFile: null,
  uploadSubmitButtonIsVisible: true,
  uploadCancelButtonLabel: 'Cancel', //TODO: translate
  uploadSubmitButtonLabel: 'Upload file', //TODO: translate
  uploadCancelButtonStyle: 'default',
  uploadSubmitButtonIsDisabled: true,
  actions: {
    didUploadImportDataFile: function(response) {
      if('import_data' in response) {
        this.set('importData', response.asset_data);
      }
    },
    importDataFileDidChange: function(file) {
      this.set('uploadSubmitButtonIsDisabled', false);
      this.set('importDataFile', file);
    },
    importDataFileUploadDidErr: function(errorResponse) {
      this.send('resetFileImportUploadState');
    },
    didSaveImportData: function(success, error) {
      this.set('uploadSubmitButtonIsVisible', false);
      this.get('uploadImportDataFile')(this.get('importDataFile')).then((response) => {
        this.set('uploadSubmitButtonIsVisible', false);
        this.set('uploadCancelButtonStyle', 'success');
        //console.log('success!');
        //success();
      }, (message) => {
        this.set('uploadSubmitButtonIsVisible', false);
        this.set('uploadCancelButtonStyle', 'danger');
        error(message);
      }).finally(() => {
        this.set('uploadCancelButtonLabel', 'Close'); //TODO: Translate
      });
    },
    didCancelImportData: function() {
      this.send('resetFileImportUploadState');
    },
    didDeleteFileImport: function(fileImport) {
      return Promise.resolve();
    },
    resetFileImportUploadState: function() {
      this.set('importData', null);
      this.set('importDataFile', null);;
      this.set('uploadSubmitButtonIsVisible', true);
      this.set('uploadCancelButtonLabel', 'Cancel'); //TODO: Translate
      this.set('uploadCancelButtonStyle', 'default');
      this.set('uploadSubmitButtonIsDisabled', true);
    }
  }
});
