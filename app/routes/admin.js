import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function(params) {
    return Ember.RSVP.hash({
      faculties: this.store.find('faculty')
    });
  },

  setupController: function(controller, model) {
    controller.set("faculties", model.faculties);
  },

});
