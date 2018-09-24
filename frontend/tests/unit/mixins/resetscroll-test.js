import Ember from 'ember';
import {
  module,
  test,
  ok
} from 'ember-qunit';
import ResetscrollMixin from 'gup/mixins/resetscroll';

module('ResetscrollMixin');

// Replace this with your real tests.
test('it works', function() {
  var ResetscrollObject = Ember.Object.extend(ResetscrollMixin);
  var subject = ResetscrollObject.create();
  ok(subject);
});
