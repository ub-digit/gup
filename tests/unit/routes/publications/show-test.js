import {
  moduleFor,
  test,
  ok
} from 'ember-qunit';

moduleFor('route:publications/show', 'PublicationsShowRoute', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it exists', function() {
  var route = this.subject();
  ok(route);
});
