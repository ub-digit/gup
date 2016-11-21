import Ember from 'ember';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  manageController: Ember.inject.controller('publications.dashboard.manage'),
  selectedSource: null,
  sourceId: null,
  error: null,
  importData: null,

  idPlaceholderString: Ember.computed('selectedSource', function() {
    let prefix = this.get('i18n').t('publications.dashboard.manage.new.importPub.form.inputId.placeholder');
    switch(this.get('selectedSource')) {
      case 'gupea':
        prefix += '12345';
        break;
      case 'pubmed':
        prefix += '25855245';
        break;
      case 'scopus':
        prefix += '10.1577/H02-043';
        break;
      case 'libris':
        prefix += '978-91-7385-325-5';
        break;
      default:
        prefix = 'ID';
        break;
    }
    return prefix;
  }),

  fetchButtonIsActive: Ember.computed('selectedSource', 'sourceId', function() {
    return (this.get('selectedSource') && this.get('sourceId'));
  }),

  actions: {
    fetchSource: function() {
      this.set('error', null);
      let successHandler = (model) => {
        this.set('importData', model);
      };
      let errorHandler = (error) => {
        this.set('error', error.error);
        this.set('importData', null);
      };
      let setImportData = this.store.save('import_data', { datasource: this.get('selectedSource'), sourceid: this.get('sourceId') }).then((model) => {
        if (model.error) {
          errorHandler(model);
        }
        else {
          successHandler(model);
        }
      }, errorHandler);
      this.send('pageIsDisabled', setImportData);
    },
    createPublication: function(model) {
      if(!model) {
        model = {};
      }
      let saveAndEditDraft = new Promise((resolve, reject) => {
        this.store.save('draft', model).then((model) => {
          this.transitionToRoute('publications.dashboard.manage.show.edit', model.id).then(resolve, reject);
        }, (error) => {
          //TODO: This code has not been tested, simulate error and test!
          this.set('error', error.error);
          reject(error);
        });
      });
      this.send('pageIsDisabled', saveAndEditDraft);
    }
  }
});
