import Ember from 'ember';

export default Ember.Component.extend({
  isHighlighted: false,
  didInsertElement() {
    if (this.get('isHighlighted')) {
      //Class binding with computed property instead?
      Ember.$(this.element).addClass('highlighted-element-accented').fadeTo(500, 0.25).fadeTo(500, 1, function() {
        Ember.run.later(() => {
          Ember.$(this).removeClass('highlighted-element-accented');
        }, 1000);
      });
    }
  }
});
