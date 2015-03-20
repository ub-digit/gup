import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import New from 'gup/routes/publications/manage/new';

export default New.extend(AuthenticatedRouteMixin, {
  model: function(params) {
    var model = this.modelFor('publications.manage.show');
    return RSVP.hash({
      publication: model,
      publicationTypes: this.store.find('publication_type')
    });
  },

  setupController: function(controller, models) {
    this._super(controller, models);
    var publicationType = models.publicationTypes.findBy('id', models.publication.publication_type_id);

    controller.set("selectedPublicationType", publicationType.publication_type_code);
    controller.set("selectedContentType", publicationType.id);

  },

  handleSuccess: function(model) {
    this.send('refreshModel', model.id);
    this.transitionTo('publications.manage.show', model.id); 
  },

  actions: {



  }
});

