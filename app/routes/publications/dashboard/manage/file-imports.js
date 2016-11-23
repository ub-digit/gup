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
      // Or set this only if publication_id set to avoid extra logic in template?
      controller.set('isShowingRecordId', isShowingRecordId);
      let expandedFileImport = model.find((fileImport) => {
        let record = fileImport.get('endnote_records').findBy('id', isShowingRecordId);
        // Only exand and highlight record if a draft/publication was actually created
        // not if used cancelled (predraft)
        // TODO: Convert to ember object in model()?
        return record !== undefined && Ember.isPresent(record.publication_id);
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
