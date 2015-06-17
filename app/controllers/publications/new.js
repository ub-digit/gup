import Ember from 'ember';

export default Ember.Controller.extend({

  selectedSource: null,
  sourceId: null,
  error: null,
  importData: null,

  idPlaceholderString: Ember.computed('selectedSource', function() {

    var prefix = this.t('newPub.importPub.form.inputId.placeholder');

    switch(this.get('selectedSource')) {

      case 'gupea':
        return prefix + '12345';
        break;
      case 'pubmed':
        return prefix + '25855245';
        break;
      case 'scopus':
        return prefix + '10.1577/H02-043';
        break;
      case 'libris':
        return prefix + '978-91-7385-325-5';
        break;
      default:
        return 'ID';
        break;
    }

  }),

  fetchButtonIsActive: Ember.computed('selectedSource', 'sourceId', function() {
    return (this.get('selectedSource') && this.get('sourceId'));
  }),

  actions: {

    fetchSource: function() {

      Ember.$('body').addClass("loading");
      this.set('error', null);

      var that = this;

      return this.store.find('import_data', {datasource: this.get('selectedSource'), sourceid: this.get('sourceId')}).then(

        function(response) {
          Ember.$('body').removeClass("loading");
          that.set('importData', response);
        },

        function(error) {
          Ember.$('body').removeClass("loading");
          that.set('error', error);
          that.set('importData', null);
        }

      );
    },

    createPublication: function(model) {
      var that = this;
      var publication = {};
      if (model) {
        publication = model;
      }
      this.store.save('publication', publication).then(
        function(response) {
          that.transitionToRoute('publications.show.edit', response.id);
        },
        function(error) {
        }
      );
    }
  }
});
