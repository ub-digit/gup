import Ember from 'ember';
import Select2 from 'ember-select-2/components/select-2';

export default Select2.extend({
  didInsertElement: function() {
    this._super(...arguments);
    var selector = '.' + this.get('cssClass');
    Ember.$(selector).find('.select2-drop').append('<div class="select2-footer"><p>' + this.get('didNotFindWhatYouWereLookingForStr') + '</p><button id="toggleBtn" class="btn btn-primary">'+ this.get('btnText') + '</button></div>');
    Ember.$(selector).find("#toggleBtn").bind('click', () => {
      Ember.run(() => {
        // Close dropdown
        this.set('zeroResult', true);
      });
    });
  },
});
