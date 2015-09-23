import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  queryParams:{
      pubyear:{refreshModel: true},
      pubtype:{refreshModel: true}
  },
  beforeModel: function() {
		Ember.$("body").addClass("loading");
	},
	afterModel: function(model, transition) {
		Ember.$("body").removeClass("loading");
    this.controllerFor('application').set('currentList', transition.targetName);
	},
  model: function(params) {
    params.list_type = 'for_biblreview';
    return Ember.RSVP.hash({
      publicationList:  this.store.find("publication", params)
    });

  },
  setupController: function(controller, models) {
    controller.set("model", models.publicationList);
    controller.set("pubyears", []);
    controller.get("pubyears").addObjects([
      {pubyear: this.t('biblreview.selectPublicationYearPrompt'), id: 0},
      {pubyear: moment().year()   + ' ' + this.t('biblreview.orLater'), id: 1},
      {pubyear: moment().year()-1, id:moment().year()-1},
      {pubyear: moment().year()-2, id:moment().year()-2},
      {pubyear: moment().year()-3, id:moment().year()-3},
      {pubyear: moment().year()-4, id:moment().year()-4},
      {pubyear: moment().year()-5 + ' ' + this.t('biblreview.orEarlier'), id:-1}
      ]);
  },
	actions: {
		editItem: function(item, params) {
			console.log("transitionTo publication.show.edit", item, params);
			this.transitionTo('publications.show.edit', item.id, {queryParams: params});
		}
	}
});
