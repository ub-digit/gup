import Ember from 'ember';

export function translateKey(params/*, hash*/) {
  return Ember.I18n.t(params[0]);
}

export default Ember.HTMLBars.makeBoundHelper(translateKey);
