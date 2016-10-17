import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('admin.messages.title');
  },
  model: function(params) {
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
      var that = this;
      model.id = null;
      this.store.save('message', model).then(function(data) {
        that.send('setMsgHeader', 'success', that.get('i18n').t('admin.messages.saved'));
      }, function(error) {
        that.send('setMsgHeader', 'error', that.get('i18n').t('admin.messages.saveError'));
      });
    },
    deleteMessage: function(model) {
      var that = this;
      model.id = null;
      this.store.destroy('message', model.message_type).then(function(response){
        that.send('setMsgHeader', 'success', that.get('i18n').t('admin.messages.deleted'));
        that.refresh();
      }, function(error) {
        that.send('setMsgHeader', 'error', that.get('i18n').t('admin.messages.deleteError'));
        console.log('delete error');
      });
    }
  }
});
