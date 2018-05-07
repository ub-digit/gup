import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ResetScroll from 'gup/mixins/resetscroll';

//import ENV from 'gup/config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, ResetScroll, {
  i18n: Ember.inject.service(),

  activate: function() {
    this._super.apply(this, arguments); // Call super at the beginning
    // Your stuff
  },
  titleToken: function() {
    return this.get('i18n').t('publications.dashboard.manage.show.edit.title');
  },
  returnTo: null,
  beforeModel: function(transition) {
    this.set('returnTo', transition.queryParams.returnTo);
    this.set('returnToModels', transition.queryParams.returnToModels);
    this.set('returnToQueryParams', transition.queryParams.returnToQueryParams);
  },
  model: function() {
    var model = this.modelFor('publications.dashboard.manage.show');
    return Ember.RSVP.hash({
      publication: this.store.find('publication', model.id),
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
    controller.set('refValueBool', models.publication.ref_value === 'ISREF');

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
    controller.set('manageController.isNavVisible', false);
  },
  resetController: function(controller, isExiting/*, transition*/) {
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
  returnToArguments: Ember.computed('returnTo', 'returnToModels', 'returnToQueryParams', function() {
    let args = [this.get('returnTo')];
    if (Ember.isPresent(this.get('returnToModels'))) {
      args.pushObject({ queryParams: this.get('returnToModels') });
    }
    if (Ember.isPresent(this.get('returnToQueryParams'))) {
      args.pushObject({ queryParams: this.get('returnToQueryParams') });
    }
    return args;
  }),
  hasReturnTo: Ember.computed.notEmpty('returnTo'),
  actions: {
    willTransition: function() {
      this.send('refreshModel', this.controller.get('publication.id'));
    },
    cancelEdit: function() {
      if (this.get('hasReturnTo')) {
        this.transitionTo(...this.get('returnToArguments'));
      } else if(this.get('controller').get('publication.process_state') === 'PREDRAFT') {
        this.transitionTo('publications.dashboard.manage.published');
      } else {
        this.transitionTo('publications.dashboard.manage.show', this.controller.get('publication.id'));
      }
    },
    // TODO: this should probably live in the controller?
    savePublication: function(isDraft) {
        // check to see if trying to save a publication with no affiliations
        let authors = this.get('controller.authorArr');
        let authorAffiliated = authors.find((author) => {
          if (author.get("selectedInstitution").length > 0) {
            return true;
          }
          return false;
        });
        if (!authorAffiliated) {
          let continueSave = confirm(this.get('i18n').t('publications.dashboard.manage.show.edit.confirm'));
          if (!continueSave) {
            return;
          }
        }
      //TODO: Ok solution for now, can be solved more elegantly?
      this.set('controller.publication.publication_links', this.get('controller.publication.publication_links').filter((link) => {
        return Ember.isPresent(link.get('url'));
      }));

      //TODO: OCD fix to prevent position gaps, later: refactor component to not use (position) interally and just set it here
      this.get('controller.publication.publication_links').sortBy('position').forEach((link, index) => {
        link.set('position', index);
      });

      let savePublication = new Ember.RSVP.Promise((resolve, reject) => {
        let successHandler = (model) => {
          let message = isDraft ?
            this.get('i18n').t('publications.dashboard.manage.show.edit.saveDraftSuccess') :
            this.get('i18n').t('publications.dashboard.manage.show.edit.publishSuccess');
          this.send('setMsgHeader', 'success', message);
          this.send('refreshModel', model.id);
          //TODO: Check why we do this, also on draft?
          if (!isDraft) {
            this.send('refreshUserdata');
          }
          return this.get('hasReturnTo') ?
            this.transitionTo(...this.get('returnToArguments')) :
            this.transitionTo('publications.dashboard.manage.show', model.id);
        };

        let errorHandler = (reason) => {
          /*
          let message = isDraft ?
            this.get('i18n').t('publications.dashboard.manage.show.edit.saveDraftError') :
            this.get('i18n').t('publications.dashboard.manage.show.edit.publishError');
            this.send('setMsgHeader', 'error', message);
          */
          this.controller.set('errors', reason.error.errors);

          if(!isDraft && this.controller.get('publication.draft_id')) {
            this.controller.set('publication.id', this.controller.get('publication.draft_id'));
            this.controller.set('publication.draft_id', null);
          }

          Ember.run.schedule('afterRender', () => {
            Ember.$('[data-toggle="popover"]').popover({
              placement: 'top',
              html: true
            });
          });
          return false; //Implications? Remove this?
        };

        let generalHandler = (model) => {
          if (!model) {
            this.send('setMsgHeader', 'error', this.get('i18n').t('publications.dashboard.manage.show.edit.systemError'));
            return;
          }
          if (model.error) {
            return errorHandler(model);
          }
          else {
            return successHandler(model);
          }
        };

        this.get('controller').submitCallbacksRun().then(() => {
          if (!isDraft && !this.controller.get('publication.published_at')) {
            this.controller.set('publication.draft_id', this.controller.get('publication.id'));
            this.controller.set('publication.id', null);
          }
          //TODO: consisistent use of either this.get('controller') or this.controller! Which is correct?
          this.get('controller').formatAuthorsForServer();
          let resource = isDraft ? 'draft' : 'published_publication';
          this.store.save(resource, this.controller.get('publication'))
            .then(generalHandler, errorHandler)
            .then(resolve, reject);
        }, (reason) => {
          reject(reason); //??
        });
      });
      this.send('pageIsDisabled', savePublication);
    }
  }
});
