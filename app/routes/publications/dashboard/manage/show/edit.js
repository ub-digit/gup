import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ResetScroll from 'gup/mixins/resetscroll';

//import ENV from 'gup/config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, ResetScroll, {
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('publications.dashboard.manage.show.edit.title');
  },
  returnTo: null,
  beforeModel: function() {
    //TODO: replace with loading substate
    //https://guides.emberjs.com/v2.8.0/routing/loading-and-error-substates/
  },
  model: function(params, transition) {
    this.returnTo = transition.queryParams.returnTo;
    var model = this.modelFor('publications.dashboard.manage.show');
    return Ember.RSVP.hash({
      publication: this.store.find("publication", model.id),
      publicationTypes: this.store.find('publication_type'),
      departments: this.store.find('department'),
      languages: this.store.find('language'),
      series: this.store.find('serie'),
      projects: this.store.find('project'),
      publicationIdentifierCodes: this.store.find('publication_identifier_code')
    });
  },
  afterModel: function(/*model, transition*/) {
  },


  setupController: function(controller, models) {
    this._super(...arguments);
    //TODO: Remove this when binding issue fixed
    if (Ember.isBlank(models.publication.publication_links)) {
      models.publication.publication_links = [{url: '', position: 0}];
      //models.publication.publication_links.pushObject({url: '', position: 0});
    }

    // GUP adapter does not return ember objects, which are needed for multiple-items component to work(?)
    models.publication.publication_links = models.publication.publication_links.map((item) => {
      return Ember.Object.create(item);
    });

    controller.set('publicationTypes', models.publicationTypes);
    controller.set('publication', models.publication);
    controller.set('categories', models.categories);
    controller.set('projects', models.projects);
    controller.set('series', models.series);
    controller.set('institutions', models.departments);
    models.departments.forEach(function(dep) {
      if(dep.name === 'Extern institution') {
        controller.set('defaultInstitution', dep);
      }
    });
    controller.set('languages', models.languages);
    controller.set('publicationIdentifierCodes', models.publicationIdentifierCodes);
    controller.set('publicationTypes', models.publicationTypes);

    if (models.publication.ref_value == "ISREF") {
      controller.set("refValueBool", true);
    }
    else {
      controller.set("refValueBool", false);
    }

    var authors = null;
    if (models.publication) {
      if (models.publication.authors) {
        if (models.publication.authors.length > 0) {
          authors = models.publication.authors;
        }
        controller.set('arrOfAuthorsFromImport', models.publication.authors_from_import);
      }
    }
    let tempAuthorArr = [];
    if (authors) {
      authors.forEach(function(author) {
        let departments = [];
        author.departments.forEach(function(department) {
          departments.push(Ember.Object.create({
            id: department.id,
            name: department.name
          }));
        });
        tempAuthorArr.push(Ember.Object.create({
          id: author.id,
          selectedAuthor: {
            id: author.id,
            presentation_string: author.presentation_string,
            last_name: author.last_name
          },
          selectedInstitution: departments
        }));
      });
      controller.set('authorArr', tempAuthorArr);
    }

    var publicationType = models.publicationTypes.findBy('id', models.publication.publication_type_id);
    if (publicationType) {
      controller.set('selectedPublicationType', publicationType.code);
    }
    else {
      controller.set('selectedPublicationType', null);
    }
    if (models.publication.publication_type_suggestion) {
      //controller.set('mayBecomeSelectedPublicationType', models.publication.publication_type_suggestion);
      controller.set('suggestedPublicationType', models.publication.publication_type_suggestion);
    } else {
      // This needs to be reset if no suggestion was found, so that any previous suggestion is removed
      controller.set('suggestedPublicationType', null);
    }
    controller.set("manageController.isNavVisible", false);
  },
  resetController: function(controller, isExiting, transition) {
    if (isExiting) {
      // @TODO: replace exit-hook with this?
    }
  },
  exit: function() {
    var controller = this.get('controller');
    //TODO: institutions?
    controller.set('selectedPublicationType', null);
    controller.set('authorArr', []);
    controller.set('mayBecomeSelectedPublicationType', null);
    controller.set('mayBecomeOldSelectedPublicationType', null);
    controller.set('errors', null);
    //TODO: temporary fix, this sucks:
    controller.set('categoryObjectsList', undefined);
  },
  actions: {
    willTransition: function() {
      this.send('refreshModel', this.controller.get('publication.id'));
    },
    cancelEdit: function() {
      if(this.returnTo) {
        this.transitionTo(this.returnTo);
      } else if(this.get('controller').get('publication.process_state') === "PREDRAFT") {
        this.transitionTo('publications.dashboard.manage.published');
      } else {
        this.transitionTo('publications.dashboard.manage.show', this.controller.get('publication.id'));
      }
    },
    // TODO: this should probably live in the controller?
    // TODO: saveDraft and savePublish does almost the same thing
    // should perhaps try to unify into one method, or break out common stuff
    saveDraft: function(/*model*/) {
      var successHandler = (model) => {
        this.send('setMsgHeader', 'success', this.get('i18n').t('publications.dashboard.manage.show.edit.saveDraftSuccess'));
        this.send('refreshModel', model.id);
        this.transitionTo('publications.dashboard.manage.show', model.id);
      };
      var errorHandler = (reason) => {
        this.send('setMsgHeader', 'error', this.get('i18n').t('publications.dashboard.manage.show.edit.saveDraftError'));
        this.controller.set('errors', reason.error.errors);
        Ember.run.schedule('afterRender', function() {
          // What happens here? Can be removed?
          Ember.$('[data-toggle="popover"]').popover({
            placement: 'top',
            html: true
          });
        });
        return false;
      };
      var generalHandler = (model) => {
        if (model.error) {
          errorHandler(model);
        }
        else {
          successHandler(model);
        }
      };

      //TODO: Ok solution for now, can be solved more elegantly?
      this.set('controller.publication.publication_links', this.get('controller.publication.publication_links').filter((link) => {
        return Ember.isPresent(link.get('url'));
      }));

      //TODO: OCD fix to prevent position gaps, later: refactor component to not use (position) interally and just set it here
      this.get('controller.publication.publication_links').sortBy('position').forEach((link, index) => {
        link.set('position', index);
      });

      // TODO: this smells, can this be made feel less hackish?
      this.get('controller').submitCallbacksRun().then(() => {
        this.get('controller').formatAuthorsForServer();
        this.store.save('draft', this.get('controller').get('publication')).then(generalHandler, errorHandler);
      }, errorHandler); //Make sure this get passed errors object in correct format (think it does)
    },
    savePublish: function(/*model*/) {
      var successHandler = (model) => {
        this.send('setMsgHeader', 'success', this.get('i18n').t('publications.dashboard.manage.show.edit.publishSuccess'));
        this.send('refreshModel', model.id);
        this.send('refreshUserdata');

        if (this.returnTo) {
          this.transitionTo(this.returnTo);
        } else {
          this.transitionTo('publications.dashboard.manage.show', model.id);
        }
      };

      var errorHandler = (reason) => {
        this.send('setMsgHeader', 'error', this.get('i18n').t('publications.dashboard.manage.show.edit.publishError'));
        this.controller.set('errors', reason.error.errors);

        if (this.controller.get('publication.draft_id')) {
          this.controller.set('publication.id', this.controller.get('publication.draft_id'));
          this.controller.set('publication.draft_id', null);
        }

        Ember.run.schedule('afterRender', () => {
          Ember.$('[data-toggle="popover"]').popover({
            placement: 'top',
            html: true
          });
        });
        return false;
      };

      var generalHandler = (model) => {
        if (!model) {
          this.send('setMsgHeader', 'error', this.get('i18n').t('publications.dashboard.manage.show.edit.systemError'));
          return;
        }
        if (model.error) {
          errorHandler(model);
        }
        else {
          successHandler(model);
        }
      };

      //TODO: Ok solution for now, can be solved more elegantly?
      this.set('controller.publication.publication_links', this.get('controller.publication.publication_links').filter((link) => {
        return Ember.isPresent(link.get('url'));
      }));

      //TODO: OCD fix to prevent position gaps, later: refactor component to not use (position) interally and just set it here
      this.get('controller.publication.publication_links').sortBy('position').forEach((link, index) => {
        link.set('position', index);
      });

      this.get('controller').submitCallbacksRun().then(() => {
        if (!this.controller.get('publication.published_at')) {
          this.controller.set('publication.draft_id', this.controller.get('publication.id'));
          this.controller.set('publication.id', null);
        }
        this.get('controller').formatAuthorsForServer();
        this.store.save('published_publication', this.controller.get('publication')).then(generalHandler, errorHandler);
      });
    }
  }
});
