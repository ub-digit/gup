import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
  queryParams:{
      pubyear:{refreshModel: true},
      page:{refreshModel: true},
      pubtype:{refreshModel: true},
      faculty:{refreshModel: true},
      only_delayed:{refreshModel: true}
  },
  beforeModel: function() {
		Ember.$("body").addClass("loading");
	},
	afterModel: function(model, transition) {
		Ember.$("body").removeClass("loading");
    this.controllerFor('application').set('currentList', transition.targetName);
	},
  model: function(params) {
    if(!params.page) {
      params.page = 1;
    }
    return Ember.RSVP.hash({
      publicationList:  this.store.find("biblreview_publication", params)
    });

  },
  setupController: function(controller, models) {
    this._super(...arguments);
    controller.set('model', models.publicationList);
  },
	actions: {
		editItem: function(item, params) {
			this.transitionTo('publications.show.edit', item.id, {queryParams: params});
		}
	}
});
