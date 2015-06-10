import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import ENV from 'gup/config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function(params) {
    var model = this.modelFor('publications.show');
    return RSVP.hash({
      publication: model,
      publicationTypes: this.store.find('publication_type'),
      departments: this.store.find("department"),
    });
  },
  setupController: function(controller, models) {
    controller.set("publicationTypes", models.publicationTypes);
    controller.set("publication", models.publication);

    controller.set('categories', models.categories);
    var arr = [];
    controller.set('authors', arr);



    controller.set('institutions', models.departments);

    if (models.publication) {
      if (models.publication.authors) {
        if (models.publication.authors.length > 0) {
          var authors = models.publication.authors;
        }
      }
    }
    var tempAuthorArr = [];
    if (authors) {
      authors.forEach(function(author) {
        var departments = [];
        author.departments.forEach(function(department) {
          departments.push(Ember.Object.create({id: department.id, name: department.name}));
        })
        tempAuthorArr.push(Ember.Object.create({id: author.id, selectedAuthor: {id: author.id, last_name: author.last_name}, selectedInstitution: departments, }));
      });
      controller.set('authorArr', tempAuthorArr);
    }
    else {
      controller.send('addNewAuthorRow');
    }

    var publicationType = models.publicationTypes.findBy('code', models.publication.publication_type);
    if (publicationType) {
      controller.set("selectedPublicationType", publicationType.code);
    }
    else {
      controller.set("selectedPublicationType", null);
    }
  },

  exit: function() {
    var controller = this.get("controller");
    controller.set('selectedContentType', null);
    controller.set('selectedPublicationType', null);
    controller.set("authorArr", []);
    controller.set("mayBecomeSelectedPublicationType", null);
    controller.set('errors', null);
  },

  actions: {
    saveDraft: function(model) {
        var that = this;
        var successHandler = function(model) {
            that.send('setMsgHeader', 'success', 'Posten har sparats.');
            Ember.$("body").removeClass("loading");
            that.send('refreshModel', model.id);
            that.transitionTo('publications.show', model.id);            
        };
        var errorHandler = function(reason) {
            that.send('setMsgHeader', 'error', 'Posten kunde inte sparas.');
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
        console.log(model);
        var that = this;
        var successHandler = function(model) {
            that.send('setMsgHeader', 'success', 'Posten har sparats.');
            Ember.$("body").removeClass("loading");
            that.send('refreshModel', model.id);
            that.transitionTo('publications.show', model.id);            
        };
        var errorHandler = function(reason) {
            that.send('setMsgHeader', 'error', 'Posten kunde inte sparas.');
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

        // Change this when adapter is rewrited
        Ember.$.ajax({
          type: 'PUT',
          url: ENV.APP.serviceURL + '/publications/publish/' + model.id,
          data: JSON.stringify({publication: this.controller.get("publication")}),
          contentType: 'application/json',
          dataType: 'json'
        }).then(successHandler, errorHandler);
      }
    }



});
