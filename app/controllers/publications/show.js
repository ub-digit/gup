import Ember from 'ember';

export default Ember.Controller.extend({
  publications: Ember.inject.controller(),
  application: Ember.inject.controller(),

  viewModeBinding: 'application.viewMode'

});
