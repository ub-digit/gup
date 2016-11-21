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
        this.set('error', error);
        this.set('importData', null);
      };
      let generalHandler = (model) => {
        if (model.error) {
          errorHandler(model.error);
        }
        else {
          successHandler(model);
        }
      };
      return this.store.save('import_data', { datasource: this.get('selectedSource'), sourceid: this.get('sourceId') }).then(
        generalHandler
      );
    },
    createPublication: function(model) {
      let publication = {};
      if (model) {
        publication = model;
      }
      this.store.save('draft', publication).then(
        (response) => {
          this.transitionToRoute('publications.dashboard.manage.show.edit', response.id);
        },
        (error) => {
        }
      );
    }
  }
});
