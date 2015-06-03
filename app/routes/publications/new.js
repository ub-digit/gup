import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return RSVP.hash({
      publication: this.store.save('publication', {datastore:'none'}),
      publicationTypes: this.store.find('publication_type'),
      departments: this.store.find('department')
    });
  },
  setupController: function(controller, models) {

    controller.set("publicationTypes", models.publicationTypes);
    controller.set("publication", models.publication);

    var arr = [];
    controller.set('authors', arr);

    console.log('departments', models.departments);

    controller.set('institutions', models.departments);

    if (models.publication) {
      if (models.publication.people) {
        if (models.publication.people.length > 0) {
          var authors = models.publication.people;
        }
      }
    }
    var tempAuthorArr = [];
    if (authors) {
      authors.forEach(function(author) {
        var departments = [];
        author.departments.forEach(function(department) {
          departments.push(Ember.Object.create({id: controller.generateUUID(), text: department.name}));
        })
        tempAuthorArr.push(Ember.Object.create({id: author.id, selectedAuthor: {id: author.id, last_name: author.last_name}, selectedInstitution: departments, }));
      });
      controller.set('authorArr', tempAuthorArr);
    }
    else {
      controller.send('addNewAuthorRow');
    }
  },

  handleSuccess: function(model) {
    this.transitionTo('publications.show', model.id);
  },
  exit: function() {
    var controller = this.get("controller");
    controller.set('selectedContentType', null);
    controller.set('selectedPublicationType', null);
    controller.set("authorArr", []);
    controller.set("mayBecomeSelectedPublicationType", null);
  },
  actions: {

    save: function(model,is_draft) {
        var that = this;
        var successHandler = function(model) {
            that.handleSuccess(model);
            Ember.$("body").removeClass("loading");
        };
        var errorHandler = function(reason) {
            that.send('setMsgHeader', 'error', 'Posten kunde inte sparas.');
            that.controller.set('errors', reason.error.errors);
            Ember.$("body").removeClass("loading");
            Ember.run.later(function() {
                Ember.$('[data-toggle="popover"]').popover();
            });
            return false;
        };
        if (is_draft === 'draft'){
            this.controller.set("publication.is_draft", true);
        }
        else {
            this.controller.set("publication.is_draft", false);
        }
        Ember.$("body").addClass("loading");
        this.get("controller").formatAuthorsForServer();
        this.store.save('publication',this.controller.get("publication")).then(successHandler, errorHandler);
    },
    hideMesgHeader: function() {
        this.controller.set('showMesgHeader', false);
        this.controller.set('hasErrors', false);
        this.controller.set('errors','');
    },

  }
});
