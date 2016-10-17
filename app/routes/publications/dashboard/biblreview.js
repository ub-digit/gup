import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {

  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('publications.dashboard.biblreview.title_page');
  },

  queryParams:{
      pubyear:{refreshModel: true},
      page:{refreshModel: true},
      pubtype:{refreshModel: true},
      faculty:{refreshModel: true},
      only_delayed:{refreshModel: true}
  },
  beforeModel: function() {
	},
	afterModel: function(model, transition) {
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
			this.transitionTo('publications.dashboard.manage.show.edit', item.id, {queryParams: params});
		}
	}
});
