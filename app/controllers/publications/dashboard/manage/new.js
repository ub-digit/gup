import Ember from 'ember';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  manageController: Ember.inject.controller("publications.dashboard.manage"),

  selectedSource: null,
  sourceId: null,
  error: null,
  importData: null,

  idPlaceholderString: Ember.computed('selectedSource', function() {

    var prefix = this.get('i18n').t('newPub.importPub.form.inputId.placeholder');

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

      var that = this;

      var successHandler = function(model) {
        that.set('importData', model);
      };

      var errorHandler = function(error) {
        that.set('error', error);
        that.set('importData', null);

      };

      var generalHandler = function(model) {
        if (model.error) {
          errorHandler(model.error);
        } 
        else {
          successHandler(model);
        }  
      };

      return this.store.save('import_data', {datasource: this.get('selectedSource'), sourceid: this.get('sourceId')}).then(
        generalHandler
      );
    },

    createPublication: function(model) {
      var that = this;
      var publication = {};
      if (model) {
        publication = model;
      }
      this.store.save('draft', publication).then(
        function(response) {
          that.transitionToRoute('publications.dashboard.manage.show.edit', response.id);
        },
        function(error) {
        }
      );
    }
  }
});
