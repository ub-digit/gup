import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  setupController: function(controller) {

    controller.set('selectedSource', null);
    controller.set('sourceId', null);
    controller.set('importData', null);
    controller.set('error', null);      

  }


});
