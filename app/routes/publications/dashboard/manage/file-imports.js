import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('publications.dashboard.manage.fileImports.title');
  },
  
  model() {
    return this.store.find('endnote_file').then((data) => {
      return data.map((endnote_file) => {
        return Ember.Object.create(endnote_file);
      });
    });
  },
  actions: {
    refreshModel: function() {
      this.refresh();
    }
  }
});
