import Ember from 'ember';

export default Ember.Controller.extend({
  manageController: Ember.inject.controller("publications.dashboard.manage"),
  publications: Ember.inject.controller(),
  application: Ember.inject.controller(),

  viewModeBinding: 'application.viewMode'


});
