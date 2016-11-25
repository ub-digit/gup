import Ember from 'ember';


export default Ember.Component.extend({
  scroller: Ember.inject.service(),
  
  isHighlighted: false,

  didInsertElement() {
      //Class binding with computed property instead?
    if (this.get('isHighlighted')) {
      this.get("scroller").scrollVertical('#' + this.get("element.id"), {duration: 300});
      Ember.$(this.element).addClass('success').fadeTo(500, 0.25).fadeTo(500, 1, function() {
        Ember.run.later(() => {
          Ember.$(this).removeClass('success');
        }, 5000);
      });
    }
  }
});
