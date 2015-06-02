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
    var publicationType = models.publicationTypes.findBy('code', models.publication.publication_type);
    if (publicationType) {
      controller.set("selectedPublicationType", publicationType.code); 
    }
    else {
      controller.set("selectedPublicationType", null);
    }
  },
  handleSuccess: function(model) {
    this.send('refreshModel', model.id);
    this.transitionTo('publications.manage.show', model.id); 
  },
});

