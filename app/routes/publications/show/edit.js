import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

//import ENV from 'gup/config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  i18n: Ember.inject.service(),
	returnTo: null,

  beforeModel: function() {
		Ember.$("body").addClass("loading");

	},

  model: function(params, transition) {
		this.returnTo = transition.queryParams.returnTo;
    var model = this.modelFor('publications.show');
    return Ember.RSVP.hash({
      publication: model,
      publicationTypes: this.store.find('publication_type'),
      departments: this.store.find("department"),
      languages: this.store.find("language"),
      series: this.store.find("serie"),
      projects: this.store.find("project"),
      publicationIdentifierCodes: this.store.find('publication_identifier_code')
    });
  },

  afterModel: function(/*model, transition*/) {
		Ember.$("body").removeClass("loading");
	},
  
  setupController: function(controller, models) {
    controller.set("publicationTypes", models.publicationTypes);
    controller.set("publication", models.publication);
    controller.set('categories', models.categories);
    controller.set('projects', models.projects);
    controller.set('series', models.series);
    controller.set('institutions', models.departments);
		models.departments.forEach(function(dep) {
			if(dep.name === "Extern institution") {
				controller.set('defaultInstitution', dep);
			}
		});
    controller.set('languages', models.languages);
    controller.set('publicationIdentifierCodes', models.publicationIdentifierCodes);
    controller.set('publicationTypes', models.publicationTypes);

		console.log("edit-setupController", models);
    var authors = null;
    if (models.publication) {
      if (models.publication.authors) {
        if (models.publication.authors.length > 0) {
           authors = models.publication.authors;
        }
        controller.set("arrOfAuthorsFromImport", models.publication.authors_from_import);
      }
    }
    var tempAuthorArr = [];
    if (authors) {
      authors.forEach(function(author) {
        var departments = [];
        author.departments.forEach(function(department) {
          departments.push(Ember.Object.create({id: department.id, name: department.name}));
        });
        tempAuthorArr.push(Ember.Object.create({id: author.id, selectedAuthor: {id: author.id, presentation_string: author.presentation_string, last_name: author.last_name}, selectedInstitution: departments, }));
      });
      controller.set('authorArr', tempAuthorArr);
    }


    var publicationType = models.publicationTypes.findBy('id', models.publication.publication_type_id);
    if (publicationType) {
      controller.set("selectedPublicationType", publicationType.code);
    }
    else {
      controller.set("selectedPublicationType", null);
    }
		if (models.publication.publication_type_suggestion) {
//controller.set('mayBecomeSelectedPublicationType', models.publication.publication_type_suggestion);
      controller.set('suggestedPublicationType', models.publication.publication_type_suggestion);
		} else {
		  // This needs to be reset if no suggestion was found, so that any previous suggestion is removed
		  controller.set('suggestedPublicationType', null);
		}
  },


  exit: function() {
    var controller = this.get("controller");
    controller.set('selectedPublicationType', null);
    controller.set("authorArr", []);
    controller.set("mayBecomeSelectedPublicationType", null);
    controller.set("mayBecomeOldSelectedPublicationType", null);
    controller.set('errors', null);
  },

  actions: {
    willTransition: function() {
      this.send('refreshModel', this.controller.get("publication.id"));
    },

    cancelEdit: function() {
			if(this.returnTo) {
				this.transitionTo(this.returnTo);
			} else {
				this.transitionTo('publications.show', this.controller.get("publication.id"));
			}
    },
    saveDraft: function(/*model*/) {
        var that = this;
        var successHandler = function(model) {
            that.send('setMsgHeader', 'success', that.get('i18n').t('messages.saveDraftSuccess'));
            Ember.$("body").removeClass("loading");
            that.send('refreshModel', model.id);
            that.transitionTo('publications.show', model.id);
        };
        var errorHandler = function(reason) {
            that.send('setMsgHeader', 'error', that.get('i18n').t('messages.saveDraftSuccess'));
            that.controller.set('errors', reason.error.errors);
            Ember.$("body").removeClass("loading");
            Ember.run.later(function() {
                Ember.$('[data-toggle="popover"]').popover({
                    placement: 'top',
                    html: true
                });
            });
            return false;
        };

        var generalHandler = function(model) {
          if (model.error) {
            errorHandler(model);
          } 
          else {
            successHandler(model);
          }
        };

        Ember.$("body").addClass("loading");
        this.get("controller").formatAuthorsForServer().then(function(){
            that.store.save(
                'draft',
                that.controller.get("publication")).then(generalHandler);
        });

    },
    savePublish: function(/*model*/) {
        var that = this;

        var successHandler = function(model) {
            that.send('setMsgHeader', 'success', that.get('i18n').t('messages.publishSuccess'));
            Ember.$("body").removeClass("loading");
            that.send('refreshModel', model.id);
            that.send('refreshUserdata');
					if(that.returnTo) {
						that.transitionTo(that.returnTo);
					} else {
						that.transitionTo('publications.show', model.id);
					}
        };
        var errorHandler = function(reason) {
            that.send('setMsgHeader', 'error', that.get('i18n').t('messages.publishError'));
            that.controller.set('errors', reason.error.errors);

            if (that.controller.get('publication.draft_id')) {
              that.controller.set('publication.id', that.controller.get('publication.draft_id'));
              that.controller.set('publication.draft_id', null);
            } 
            Ember.$("body").removeClass("loading");
            Ember.run.later(function() {
                Ember.$('[data-toggle="popover"]').popover({
                    placement: 'top',
                    html: true
                });
            });
            return false;
        };

        var generalHandler = function(model) {
          if (model.error) {
            errorHandler(model);
          } 
          else {
            successHandler(model);
          }
        };

        Ember.$("body").addClass("loading");

        if (!that.controller.get('publication.published_at')) {
          that.controller.set('publication.draft_id', that.controller.get('publication.id'));
          that.controller.set('publication.id', null);
        }

        this.get("controller").formatAuthorsForServer().then(function(){
            that.store.save('published_publication',that.controller.get("publication")).then(generalHandler);
        });
      }
    }



});
