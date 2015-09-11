import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import ENV from 'gup/config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	returnTo: null,
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

		console.log("edit-setupController", models);

    if (models.publication) {
      if (models.publication.authors) {
        if (models.publication.authors.length > 0) {
          var authors = models.publication.authors;
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
        })
        tempAuthorArr.push(Ember.Object.create({id: author.id, selectedAuthor: {id: author.id, presentation_string: author.presentation_string, last_name: author.last_name}, selectedInstitution: departments, }));
      });
      controller.set('authorArr', tempAuthorArr);
    }


    var publicationType = models.publicationTypes.findBy('code', models.publication.publication_type);
    if (publicationType) {
      controller.set("selectedPublicationType", publicationType.code);
    }
    else {
      controller.set("selectedPublicationType", null);
    }
		if (models.publication.publication_type_suggestion) {
			controller.set('mayBecomeSelectedPublicationType', models.publication.publication_type_suggestion);
		}
  },

  exit: function() {
    var controller = this.get("controller");
    controller.set('selectedContentType', null);
    controller.set('selectedPublicationType', null);
    controller.set("authorArr", []);
    controller.set("mayBecomeSelectedPublicationType", null);
    controller.set("mayBecomeOldSelectedPublicationType", null);
    controller.set('errors', null);
  },

  actions: {
    cancelEdit: function() {
      this.send('refreshModel', this.controller.get("publication.id"));
			if(this.returnTo) {
				this.transitionTo(this.returnTo);
			} else {
				this.transitionTo('publications.show', this.controller.get("publication.id"));
			}
    },
    saveDraft: function(model) {
        var that = this;
        var successHandler = function(model) {
            that.send('setMsgHeader', 'success', that.t('messages.saveDraftSuccess'));
            Ember.$("body").removeClass("loading");
            that.send('refreshModel', model.id);
            that.transitionTo('publications.show', model.id);
        };
        var errorHandler = function(reason) {
            that.send('setMsgHeader', 'error', that.t('messages.saveDraftSuccess'));
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

        Ember.$("body").addClass("loading");
        this.get("controller").formatAuthorsForServer();
        this.store.save('publication',this.controller.get("publication")).then(successHandler, errorHandler);
    },
    savePublish: function(model) {
        var that = this;
        var successHandler = function(model) {
            that.send('setMsgHeader', 'success', that.t('messages.publishSuccess'));
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
            that.send('setMsgHeader', 'error', that.t('messages.publishError'));
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

        Ember.$("body").addClass("loading");
        this.get("controller").formatAuthorsForServer();


        this.store.save('publish',this.controller.get("publication")).then(successHandler, errorHandler);
      }
    }



});
