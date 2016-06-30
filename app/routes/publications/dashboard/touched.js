import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  queryParams:{
      page:{refreshModel: true}
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
    params.registrator = 'logged_in_user';
    return  this.store.find("published_publication", params);
  }
});

