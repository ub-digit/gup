import Ember from 'ember';

export default Ember.Component.extend({


  allFieldObjects: Ember.computed('publicationType.all_fields', function() {
    var o = Ember.Object.create();
    this.get('publicationType.all_fields').forEach(function(field) {
      Ember.set(o, field.name, field);
    });
    return o;
  })
  
});
