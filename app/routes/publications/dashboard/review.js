import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
  beforeModel: function() {
		Ember.$("body").addClass("loading");
	},
	afterModel: function(model, transition) {
		Ember.$("body").removeClass("loading");
    this.controllerFor('application').set('currentList', transition.targetName);
	},
  model: function() {
    return this.store.find("review_publication");
  },
	actions: {
		editItem: function(item, params) {
//			console.log("transitionTo publication.show.edit", item, params);
			this.transitionTo('publications.dashboard.manage.show.edit', item.id, {queryParams: params});
		}
	}
});
