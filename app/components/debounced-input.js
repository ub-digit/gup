//
// To be used like this:
//
//
// {{debounced-input
// placeholder="1000000"
// value=propertyName
// debounceWait=300 <-- debounce wait value
// fireAtStart=false <-- corresponds to Ember.run.debounce’s 4th param, if false, will run at the end of wait period
// class="form-control" <-- all regular text input attributes work
// name="price"
// }}
import Ember from 'ember';

export default Ember.TextField.extend({
  debounceWait: 500,
  fireAtStart: true,

  _elementValueDidChange: function() {
    Ember.run.debounce(this, this._setValue, this.debounceWait, this.fireAtStart);
  },
  _setValue: function () {
    this.set('value', this.$().val());
  }
}); 
