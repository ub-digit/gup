import Ember from 'ember';
import {
  module,
  test,
  ok
} from 'ember-qunit';
import { initialize } from 'gup/initializers/inject-store';

var container, application;

module('InjectStoreInitializer', {
  setup: function() {
    Ember.run(function() {
      container = new Ember.Container();
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function() {
  initialize(container, application);

  // you would normally confirm the results of the initializer here
  ok(true);
});
