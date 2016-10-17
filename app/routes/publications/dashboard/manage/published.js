import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
    i18n: Ember.inject.service(),
    titleToken: function() {
      return this.get("i18n").t('publications.dashboard.manage.published.title');
    },
    queryParams:{
        page:{refreshModel: true}
    },	
	beforeModel: function() {
	},
	afterModel: function(model, transition) {
		this.controllerFor('application').set('currentList', transition.targetName);
	},

  model: function(params){
    if(!params.page) {
      params.page = 1;
    }    
    params.actor = 'logged_in_user';
    return  this.store.find("published_publication", params);
  },
  setupController: function(controller, model) {
    controller.set("model", model);
    controller.set("manageController.isNavVisible", true);
  }
});
