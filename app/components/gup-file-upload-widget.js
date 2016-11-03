import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  i18n: Ember.inject.service(),
  fileUploadProgress: 0,
  errors: Ember.A([]),
  fileLabel: null,
  isShowingUploadModal: false,
  faIconClass: 'fa-paperclip',
  parentUploadFile: null,
  cancelButtonIsVisible: true,
  cancelButtonStyle: 'default',
  submitButtonIsVisible: true,
  submitButtonIsDisabled: false,
  fileUploadIsVisible: true,
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
    if (Ember.isBlank(this.get('cancelLabel'))) {
      this.set('cancelLabel', this.get('i18n').t('components.fileUploadWidget.cancelLabel'));
    }
    if (Ember.isBlank(this.get('submitLabel'))) {
      this.set('submitLabel', this.get('i18n').t('components.fileUploadWidget.submitLabel'));
    }
  },
  didInsertElement() {
    //Force two way binding
    if (this.attrs.parentUploadFile !== undefined) {
      this.attrs.parentUploadFile.update(this.get('parentUploadFile'));
    }
  },
  hasError: Ember.computed('errors', function() {
    return Ember.isPresent(this.get('errors'));
  }),
  chooseFileLabelOrFileLabel: Ember.computed('chooseFileLabel', 'fileLabel', function() {
    return Ember.isPresent(this.get('fileLabel')) ? this.get('fileLabel') : this.get('chooseFileLabel');
  }),
  actions: {
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
      this.sendAction('fileDidChange', file);
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
        this.send('resetState');
      };
      let error = (reason) => {
        if (reason) {
          this.get('errors').pushObject(reason);
        }
      };
      this.sendAction('didSave', success, error);
    },
    didCancel: function() {
      this.send('resetState');
      this.sendAction('didCancel');
    },
    resetState: function() {
      this.set('fileLabel', null);
      this.get('errors').clear();
    }
  }
});
