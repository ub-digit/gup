import { formatAuthors } from 'gup/helpers/format-authors';
import { module, test } from 'qunit';

module('Unit | Helper | format authors');

test('returns empty string if authors array is empty', function(assert) {
  let result = formatAuthors([[]]);
  assert.equal(result, '');
});

test('returns authors as string in expected format', function(assert) {
 let result = formatAuthors([[
      { first_name: 'Test', last_name: 'McTesty' },
      { first_name: '', last_name: 'Testsson'}
  ]]);
  assert.equal(result, 'Test McTesty, Testsson');
});

