import Ember from 'ember';


export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  importDataBaseUrl: null,
  uploadImportDataFile: null,
  importDataFile: null,
  uploadSubmitButtonIsVisible: true,
  uploadCancelButtonStyle: 'default',
  uploadCancelButtonLabel: null,
  uploadSubmitButtonIsDisabled: true,
  uploadFileUploadIsVisible: true,
  hasSuccessfullUpload: false,
  init() {
    this._super(...arguments);
    this.set('importDataBaseUrl', Ember.getOwner(this).resolveRegistration('config:environment').APP.serviceURL + '/endnote_files');
    this.set('uploadCancelButtonLabel', this.get('i18n').t('publications.dashboard.manage.fileImports.uploadCancelLabel'));
  },
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
      this.set('uploadSubmitButtonIsDisabled', true);
      this.get('uploadImportDataFile')(this.get('importDataFile')).then((response) => {
        this.set('uploadSubmitButtonIsVisible', false);
        this.set('uploadFileUploadIsVisible', false);
        this.set('uploadCancelButtonStyle', 'success');
        this.set('uploadCancelButtonLabel', this.get('i18n').t('publications.dashboard.manage.fileImports.uploadCloseLabel'));
        this.set('hasSuccessfullUpload', true);
        this.send('refreshModel');
        success();
      }, (message) => {
        this.set('hasSuccessfullUpload', false);
        this.set('uploadSubmitButtonIsDisabled', false);
        error(message);
      });
    },
    didCancelImportData: function() {
      this.send('resetFileImportUploadState');
    },
    didDeleteFileImport: function(fileImport) {
      return this.store.destroy('endnote_file', fileImport.get('id')).then((response) => {
        this.send('refreshModel');
        this.send(
          'setMsgHeader',
          'success',
          this.get('i18n').t('publications.dashboard.manage.fileImports.deletionSuccess', { filename: fileImport.name })
        );
      }, (errorResponse) => {
        //@TODO: Display backend error reason?
        this.send(
          'setMsgHeader',
          'error',
          this.get('i18n').t('publications.dashboard.manage.fileImports.deletionError', { filename: fileImport.name })
        );
      });
    },
    resetFileImportUploadState: function() {
      this.set('importData', null);
      this.set('importDataFile', null);
      this.set('uploadSubmitButtonIsVisible', true);
      this.set('uploadCancelButtonLabel', this.get('i18n').t('publications.dashboard.manage.fileImports.uploadCancelLabel'));
      this.set('uploadCancelButtonStyle', 'default');
      this.set('uploadSubmitButtonIsDisabled', true);
      this.set('uploadFileUploadIsVisible', true);
      this.set('hasSuccessfullUpload', false);
    },
    importEndNoteRecord: function(record) {
      let importRecordAndEdit = new Promise((resolve, reject) => {
        Ember.run.later(() => {
        this.store.save('import_data', { datasource: 'endnote', sourceid: record.id }).then((model) => {
          if (model.error) {
            //Let our last resort error handler deal with this
            reject(model.error.msg);
          }
          else {
            this.store.save('draft', model).then((model) => {
              // This is so sweet
              // Second catch function needed? Check what happens with invalid id
              this.transitionToRoute('publications.dashboard.manage.show.edit', model.id).then(resolve, resolve);
            }, (error) => {
              Ember.run(() => {
                this.send('setMsgHeader', 'error', error.error.msg);
                resolve();
              });
            });
          }
        }, (error) => {
          reject(error.error.msg);
        });
        }, 1000);
      }).catch((reason) => {
        Ember.run(() => {
          this.send('setMsgHeader', 'error', reason);
        });
      });
      this.send('pageIsDisabled', importRecordAndEdit);
    },
  }
});
