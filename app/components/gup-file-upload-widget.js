import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  i18n: Ember.inject.service(),
  refreshModelAction: 'refreshModel',
  setMsgHeader: 'setMsgHeader',
  fileUploadProgress: 0,
  parentHasErrors: false,
  errors: Ember.A([]),
  hasNoUploadedFile: true,
  fileLabel: null,
  isShowingUploadModal: false,
  //resetFileUploadState: undefined, //@FIXME: This hack is quite horrid, must be some other way?
  init: function() {
    this._super(...arguments);
    if (Ember.isBlank(this.get('openModalLabel'))) {
      this.set('openModalLabel', this.get('i18n').t('components.fileUploadWidget.openModalLabel'));
    }
    if (Ember.isBlank(this.get('modalTitle'))) {
      this.set('modalTitle', this.get('i18n').t('components.fileUploadWidget.modalTitle'));
    }
    if (Ember.isBlank(this.get('chooseFileLabel'))) {
      this.set('chooseFileLabel', this.get('i18n').t('components.fileUploadWidget.chooseFileLabel'));
    }
    //TODO: abort => cancel?
    if (Ember.isBlank(this.get('abortFileSaveLabel'))) {
      this.set('abortFileSaveLabel', this.get('i18n').t('components.fileUploadWidget.abortFileSaveLabel'));
    }
    if (Ember.isBlank(this.get('saveFileLabel'))) {
      this.set('saveFileLabel', this.get('i18n').t('components.fileUploadWidget.saveFileLabel'));
    }
  },
  hasError: Ember.computed('parentHasErrors', 'errors', function() {
    return this.get('parentHasErrors') || Ember.isPresent(this.get('errors'));
  }),
  chooseFileLabelOrFileLabel: Ember.computed('chooseFileLabel', 'fileLabel', function() {
    return Ember.isPresent(this.get('fileLabel')) ? this.get('fileLabel') : this.get('chooseFileLabel');
  }),
  actions: {
    didUploadFile(response) {
      this.set('hasNoUploadedFile', false);
      this.sendAction('didUploadFile', response);
    },
    fileUploadDidErr(errorResponse) {
      //???
      this.set('hasNoUploadedFile', true);
      this.sendAction('fileUploadDidErr', errorResponse);
    },
    fileDidChange(file) {
      function humanFileSize(bytes, si) {
        var thresh = si ? 1000 : 1024;
        if(Math.abs(bytes) < thresh) {
          return bytes + ' B';
        }
        var units = si
          ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
          : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
        var u = -1;
        do {
          bytes /= thresh;
          ++u;
        } while(Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1)+' '+units[u];
      }
      this.set('fileLabel', Ember.isPresent(file) ? file.name + ' (' + humanFileSize(file.size) + ')' : null);
    },
    showUploadModal: function() {
      this.set('isShowingUploadModal', true);
    },
    hideUploadModal: function() {
      this.set('isShowingUploadModal', false);
    },
    didSave: function() {
      let success = () => {
        this.set('isShowingUploadModal', false);
        //TODO: reset state
      };
      let error = (reason) => {
        if (reason) {
          this.errors.pushObject(reason);
        }
      };
      this.sendAction('didSave', success, error);
    },
    didCancel: function() {
      this.set('hasNoUploadedFile', true); //TODO: !?!?
      //TODO: clean up state? Yes we should
      //@FIXME
      this.send('resetState');
      this.sendAction('didCancel');
    },
    resetState: function() {
      this.get('resetFileUploadState')();
    }
  }
});
