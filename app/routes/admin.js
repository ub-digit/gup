import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  i18n: Ember.inject.service(),
  titleToken: function() {
    //return this.get("i18n").t('admin.title');
  },
  model: function() {
    return Ember.RSVP.hash({
      faculties: this.store.find('faculty')
    });
  },

  setupController: function(controller, model) {
    this._super(...arguments);
    controller.set("faculties", model.faculties);
  },

});
