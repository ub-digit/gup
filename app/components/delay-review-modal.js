import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  setMsgHeaderAction: 'setMsgHeader',
  optDate: 'calendar',
  optText: 'freetext',

  startDate: Ember.computed('publication.bibl_review_start_time', function(){
    return moment(this.get('publication.bibl_review_start_time')).format('YYYY-MM-DD');
  }),
  isDelayed: Ember.computed('publication.bibl_review_start_time', function(){
    if (!this.get('publication.bibl_review_start_time')) {
      return false;
    }
    if (moment(this.get('publication.bibl_review_start_time'))> moment()){
      return true;
    }
    return false;
  }),

  datePickerDisabled: Ember.computed('optDate', function(){
    return (this.get('optDate') !== 'calendar');
  }),

  commentFieldDisabled: Ember.computed('optText', function(){
    return (this.get('optText') !== 'freetext');
  }),
  actions: {
    dateOptionChanged: function(){
      switch(this.get('optDate')){
        case 'onemonth':
          this.set('date', moment().add(1, 'months'));
          break;
        case 'threemonths':
          this.set('date', moment().add(3, 'months'));
          break;
        case 'sixmonths':
          this.set('date', moment().add(6, 'months'));
          break;
      }
    },

    textOptionChanged: function(){
      switch(this.get('optText')){
        case 'freetext':
          break;
        case 'e-pub-ahead':
          this.set('comment', 'E-pub ahead of print');
          break;
      }
    },

    sendDelay: function(){
      var that = this;
      var publication = that.get('publication');
      var date = moment(that.get('date')).format('YYYY-MM-DD');
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
