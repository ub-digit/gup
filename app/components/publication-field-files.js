import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  fileBaseUrl: ENV.APP.fileURL,
  refreshModelAction: 'refreshModel',
  setMsgHeaderAction: 'setMessage',

  init: function() {
    this._super(...arguments);
    // TODO: this is never used? Needed?
    this.set('token', this.get('session.data.authenticated.token'));
  },

  actions: {
    removeFile: function(id) {
      let result = window.confirm('Är du säker på att du vill ta bort filen?'); // @FIXME Translation
      if (!result) {
        return;
      }
      else {
        // Delete file
        this.store.destroy('asset_data', id).then(() => {
          this.sendAction('refreshModelAction', this.get('publication.id'));
          this.sendAction('setMsgHeaderAction', 'success', 'Filen har tagits bort'); // @FIXME Translation
        });
      }
    }
  }
});
