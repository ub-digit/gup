import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
  queryParams:{
      page:{refreshModel: true}
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
    params.registrator = 'logged_in_user';
    return  this.store.find("published_publication", params);
  }
});

