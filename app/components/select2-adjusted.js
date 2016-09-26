import Ember from 'ember';
import Select2 from 'ember-select-2/components/select-2';

var get = Ember.get;
var run = Ember.run;
export default Select2.extend({
  didInsertElement: function() {
    this._super(...arguments);
    var self = this;
    Ember.run.later(function() {
      Ember.$("." + self.get('cssClass')).find("#toggleBtn").bind('click', function() {
        self.set("zeroResult", true);
        // close dropdown
      });
    });
    Ember.$("." + self.get('cssClass')).find('.select2-drop').append("<div class='select2-footer'><p>" + this.get("didNotFindWhatYouWereLookingForStr") + "</p><button id='toggleBtn' class='btn btn-primary'>"+ this.get("btnText") + "</button></div>");
  },
});
