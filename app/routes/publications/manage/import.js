import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	actions: {
		import: function(selectedSource, id) {
			// gupea - 38154
			var self = this;
			var successHandler = function(model) {
				self.transitionTo('publications.manage.show', model.id);
			}
			var errorHandler = function(error) {
				console.log(error);
			}
			this.store.save('publication', {}, {"datasource": selectedSource, "sourceid": id}).then(successHandler, errorHandler);

		}
	}
});