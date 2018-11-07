import { isOdd } from 'gup/helpers/is-odd';
import { module, test } from 'qunit';

module('Unit | Helper | get odd');

// Replace this with your real tests.
test('it works', function(assert) {
  //TODO: Write tests for this one as practice, should be very, very easy
  let result = isOdd([42]);
  assert.ok(result);
});
