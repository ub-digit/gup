import Ember from 'ember';

export function oneIndex(params) {
  let index = parseInt(params[0]);
  return ++index;
}
export default Ember.Helper.helper(oneIndex);
