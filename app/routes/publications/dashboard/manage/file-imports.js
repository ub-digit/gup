import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('publications.dashboard.manage.fileImports.title');
  },
  beforeModel: function(transition) {
    this.set('isShowingRecordId', transition.queryParams.isShowingRecordId);
  },
  setupController(controller, model) {
    this._super(...arguments);
    controller.set('fileImportActiveItems', []);
    if (Ember.isPresent(this.get('isShowingRecordId'))) {
      let isShowingRecordId = parseInt(this.get('isShowingRecordId'));
      controller.set('isShowingRecordId', isShowingRecordId);
      let expandedFileImport = model.find((fileImport) => {
        //let endnote_records = fileImport.get('endnote_records').map((record) => { return Ember.Object.create(record); });
        return fileImport.get('endnote_records').findBy('id', isShowingRecordId) !== undefined;
      });
      if (Ember.isPresent(expandedFileImport)) {
        controller.get('fileImportActiveItems').pushObject(expandedFileImport);
      }
    }
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
