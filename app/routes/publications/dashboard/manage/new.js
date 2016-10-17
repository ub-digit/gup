import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('publications.dashboard.manage.new.title');
  },
  model: function() {
    return Ember.RSVP.hash({dataSources: this.store.find("data_source")});
  },

  setupController: function(controller, model) {
    this._super();

    controller.set('selectedSource', null);
    controller.set('sourceId', null);
    controller.set('importData', null);
    controller.set('error', null);

    var dataSources = model.dataSources.map(function(source) {
      return {value: source.code, label: source.label};
    });
    controller.set('dataSources', dataSources);
    controller.set("manageController.isNavVisible", false);

  }

});
