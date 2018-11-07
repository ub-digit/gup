import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('admin.messages.title');
  },
  model: function() {
    return Ember.RSVP.hash({
      news_message: this.store.find('message', 'NEWS'),
      alert_message: this.store.find('message', 'ALERT')
    });
  },
  setupController: function(controller, model) {
    this._super(...arguments);
    var news_message = {};
    var alert_message = {};
    if (model.news_message.message) {
      news_message = model.news_message;
    } else {
      news_message = {message_type: 'NEWS', message: '', start_date: null, end_date: null};
    }

    if (model.alert_message.message) {
      alert_message = model.alert_message;
    } else {
      alert_message = {message_type: 'ALERT', message: '', start_date: null, end_date: null};
    }

    controller.set('news_message', news_message);
    controller.set('alert_message', alert_message);
  },
  actions: {
    saveMessage: function(model) {
      model.id = null;
      this.store.save('message', model).then(() => {
        this.send('setMsgHeader', 'success', this.get('i18n').t('admin.messages.saved'));
      }, () => {
        this.send('setMsgHeader', 'error', this.get('i18n').t('admin.messages.saveError'));
      });
    },
    deleteMessage: function(model) {
      model.id = null;
      this.store.destroy('message', model.message_type).then(() => {
        this.send('setMsgHeader', 'success', this.get('i18n').t('admin.messages.deleted'));
        this.refresh();
      }, () => {
        this.send('setMsgHeader', 'error', this.get('i18n').t('admin.messages.deleteError'));
      });
    }
  }
});
