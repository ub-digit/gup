import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  classNames: ['delay-review-modal'],
  setMsgHeaderAction: 'setMsgHeader',
  optDate: 'calendar',
  optText: 'freetext',

  startDate: Ember.computed('publication.biblreview_postponed_until', function(){
    return moment(this.get('publication.biblreview_postponed_until')).format('YYYY-MM-DD');
  }),
  isDelayed: Ember.computed('publication.biblreview_postponed_until', function(){
    if (!this.get('publication.biblreview_postponed_until')) {
      return false;
    }
    if (moment(this.get('publication.biblreview_postponed_until'))> moment()){
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
      var publication = this.get('publication');
      var date = moment(this.get('date')).format('YYYY-MM-DD');
      var comment = this.get('comment');
      this.store.save('postpone_date', { publication_id: publication.id, postponed_until: date, comment: comment}).then(
        () => {
          this.sendAction('setMsgHeaderAction', 'success', this.get('i18n').t('components.delayReviewModal.delaySuccess'));
          this.get('targetObject').transitionToRoute('publications.dashboard.biblreview');
        },
        () => {
          this.sendAction('setMsgHeaderAction', 'error', this.get('i18n').t('components.delayReviewModal.delayError'));
        }
      );
    }
  }
});
