import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return Ember.RSVP.hash({
      departments: this.store.find('department')
    });
  },
  setupController: function(controller, models) {
    controller.set('departments', models.departments);
    controller.set('filters', {});
    controller.set('columns', {});
    controller.set('model', {});
    var pubTypes = controller.get('publicationsController.publicationTypes').map(function(item) {
      return {
        name: item.name,
        code: item.code,
        checked: false
      };
    });
    controller.set('publicationTypes', pubTypes);
  },
  actions: {
    createReport: function(filter, columns) {
      var controller = this.controller;
      this.store.save('report', {filter: filter, columns: columns}).then(function(model) {
        controller.set('model', model);
      });
    },
    queryAuthors: function(query, deferred) {
	    deferred.reject = function(reason) {
	      console.log(reason);
	    };
	    var fromStore = this.store.find("person", {search_term: query.term, require_xaccount: true});
	    fromStore.then(deferred.resolve, deferred.reject);
	  },
  }
});
