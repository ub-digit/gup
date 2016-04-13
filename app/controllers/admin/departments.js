import Ember from 'ember';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  queryParams: ['qd'],
  qd: '',
  query: '',
  current: null,
  newEndYear: null,

  modalValid: Ember.computed('current.start_year', 'newEndYear', function () {
    var newEndYear = this.get('newEndYear');
    if(newEndYear > 9999 || newEndYear < 1900) {
      return false;
    }
    if(this.get('current.start_year') > newEndYear) {
      return false;
    }
    // If any other characters than numbers in year
    if(parseInt(newEndYear).toString() !== newEndYear) {
      return false;
    }
    return true;
  }),

  modalInvalidShowInfo: Ember.computed('modalValid', 'newEndYear', function() {
    var newEndYear = this.get('newEndYear');
    
    if(newEndYear === null) {
      return false;
    }
    if(newEndYear < 1000) {
      return false;
    }
    if(!this.get('modalValid')) {
      return this.get('i18n').t('messages.invalidYear');
    }
    return false;
  }),
  
  actions: {
    sendQuery: function() {
      this.set('qd', this.get('query'));
    },
    toggleSetEndYear: function(dep) {
      this.set('current', dep);
      this.set('modalError', null);
      this.set('newEndYear', null);
      Ember.$('#setEndYearModal').modal('show');
    }
  }
});
