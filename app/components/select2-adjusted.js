import Ember from 'ember';
import Select2 from 'ember-select-2/components/select-2';

export default Select2.extend({
  didInsertElement: function() {
    this._super(...arguments);

    // GUB: Listen for select2 opening so that we can populate the search field
    // with provided data.
    // Only populate field if setDefaultQuery tells us to do so.
    this._select.on('select2-opening', Ember.run.bind(this, function() {
      if (this.get('setDefaultQuery')) {
        Ember.run.schedule('afterRender',  () => {
          Ember.$('.' + this.get('cssClass'))
            .find('input.select2-input')
            .first()
            .val(this.get('defaultQuery'));
          this._select.select2('search', this.get('defaultQuery'));
        });
      }
    }));
    /*
    var self = this;
    this._select.on("select2-opening", Ember.run.bind(this, function() {
      if(self.get('setDefaultQuery')) {
        Ember.run.later(function() {
          var inputs = Ember.$('.'+self.get('cssClass')).find('input.select2-input');
          inputs.first().val(self.get('defaultQuery'));
          self._select.select2('search', self.get('defaultQuery'));
        });
      }
    }));
    */

    var selector = '.' + this.get('cssClass');
    var that = this;
    Ember.run.schedule('afterRender',  () => {
      Ember.$(selector).find('.select2-drop').append('<div class="select2-footer"><i class="fa fa-info-circle"></i> ' + that.get('didNotFindWhatYouWereLookingForStr') + ' <a href="javascript:void()" id="toggleBtn">'+ that.get('btnText') + '</a></div>');
      if (this.get("defaultQuery")) {
        Ember.$(selector).select2('open');
      }
      Ember.$(selector).find("#toggleBtn").bind('click', () => {
        Ember.run(() => {
          // Close dropdown
          this.set('zeroResult', true);
        });
      });
    });

  },
});
