import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  setMsgHeaderAction: 'setMsgHeader',
  actions: {
    sendDelay: function(){
      var that = this;
      var publication = that.get('publication');
      var date = that.get('date');
      var comment = that.get('comment');
      that.store.find('set_bibl_review_start_time', publication.pubid, {date: date, comment: comment}).then(
        function(response){
          that.sendAction('setMsgHeaderAction', 'success', that.get('i18n').t('messages.delaySuccess'));
          that.get('targetObject').transitionToRoute('publications.dashboard.biblreview');
        },
        function(error) {
          that.sendAction('setMsgHeaderAction', 'error', that.get('i18n').t('messages.delayError'));
        }
        );
    }
  }
});
