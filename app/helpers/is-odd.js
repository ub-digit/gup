import Ember from 'ember';

export function isOdd([i, ...args]) {
  let _isOdd = i % 2 === 1;
  if(!args.length) {
    return _isOdd;
  }
  if(args.length === 1) {
    return _isOdd ? args[0] : '';
  }
  return _isOdd ? args[0] : args[1];
}

export default Ember.Helper.helper(isOdd);
