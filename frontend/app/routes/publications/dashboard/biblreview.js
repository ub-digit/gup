import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('publications.dashboard.biblreview.title_page');
  },
  queryParams:{
    pubyear:{refreshModel: true},
    page:{refreshModel: true},
    pubtype:{refreshModel: true},
    faculty:{refreshModel: true},
    only_delayed:{refreshModel: true}
  },
  afterModel: function(model, transition) {
    this.controllerFor('application').set('currentList', transition.targetName);
  },
  model: function(params) {
    if(!params.page) {
      params.page = 1;
    }
    return Ember.RSVP.hash({
      publicationList:  this.store.find("biblreview_publication", params)
    });

  },
  setupController: function(controller, models) {
    this._super(...arguments);

    // Super ugly hack
    let model = models.publicationList.publications;
    model.meta = models.publicationList.meta;
    // Little bit unsure about this one, safe and correct? Probably very minor risk for errors anyway
    model.error = models.publicationList.error;
    controller.set('model', model);
    let publicationTypes = models.publicationList.publication_types;
    publicationTypes.unshift({
      'id': null
    });
    controller.set('publicationTypes', models.publicationList.publication_types);

    if (controller.get('pubtype')) {
       let id = controller.get('pubtype');
       controller.set('selectedPublicationType', null);
       controller.get('publicationTypes').forEach(function (publicationType) {
         if (publicationType.id == id) {
           controller.set('selectedPublicationType', publicationType);
         }
       });
    }
  },
  actions: {
    editItem: function(item, params) {
      this.transitionTo('publications.dashboard.manage.show.edit', item.id, {queryParams: params});
    }
  }
});
