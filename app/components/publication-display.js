import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['publication-display'],

  classNameBindings: ['isReviewMode:publication-review-list', 'isPreviewMode:publication-preview-list'],

  isReviewMode: Ember.computed.equal('mode', 'review'),
  isPreviewMode: Ember.computed.equal('mode', 'preview'),

  allFieldObjects: Ember.computed('publicationType.all_fields', function() {
    var o = Ember.Object.create();
    this.get('publicationType.all_fields').forEach(function(field) {
      Ember.set(o, field.name, field);
    });
    return o;
  })

});
