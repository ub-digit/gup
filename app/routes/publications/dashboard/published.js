import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	beforeModel: function() {
		Ember.$("body").addClass("loading");
	},
	afterModel: function() {
		Ember.$("body").removeClass("loading");
	},

  model: function(){
    return this.store.find("publication", {is_actor: true});
  },

});
