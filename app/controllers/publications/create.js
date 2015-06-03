import Ember from 'ember';

export default Ember.Controller.extend({

  sources: [
    {value:'pubmed', label:'PubMed'},
    {value:'gupea',  label:'GUPEA'},
    {value:'scopus', label:'Scopus'},
    {value:'libris', label:'Libris'}
  ],

  selectedSource: null,
  sourceId: null,

  error: null,
  importData: null,

  // utöka kollen så att den innefattar även sources
  fetchButtonIsActive: Ember.computed.notEmpty('sourceId'),

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

    import: function() {

      var that = this;

      this.store.save('publication', this.get('importData')).then(

        function(response) {
          that.transitionToRoute('publications.show.edit', response.id);

        },

        function(error) {



        }
      );
    }
  }
});
