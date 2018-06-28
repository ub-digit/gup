import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Route.extend({
  titleToken: function(model) {
    return model.publication.title;
  },
  model: function(params) {
    return Ember.RSVP.hash({
      publicationTypes: this.store.find('publication_type'),
      publication: this.store.find('publication', params.id)
    });
  },

  afterModel: function(models) {
    // Set head tags only when publication exists
    if (models.publication.id) {
      this.setHeadTags(models);
    }
  },

  setupController: function(controller, models) {
    controller.set("publication", models.publication);
    controller.set("publicationTypes", models.publicationTypes);

    var publicationType = models.publicationTypes.findBy('id', models.publication.publication_type_id);
    if (!models.publication.error && publicationType) {
      controller.set('selectedPublicationType', publicationType.code);
    }
    else {
      controller.set('publication', null);
      controller.set('selectedPublicationType', null);
    }
  },

  setHeadTags: function(models) {
    var headTags = [];

    headTags.push({type: 'link', attrs: {rel: 'canonical', content: ENV.APP.publicationURL + '/' + models.publication.id}});
    if (models.publication.keywords) {
      headTags.push({type: 'meta', attrs: {name: 'keywords', content: models.publication.keywords}});
    }
    headTags.push({type: 'meta', attrs: {name: 'citation_title', content: models.publication.title}});
    headTags.push({type: 'meta', attrs: {name: 'citation_publication_date', content: models.publication.pubyear}});
    if (models.publication.abstract) {
      headTags.push({type: 'meta', attrs: {name: 'citation_abstract', content: models.publication.abstract}});
    }
    if (models.publication.publanguage) {
      headTags.push({type: 'meta', attrs: {name: 'citation_language', content: models.publication.publanguage}});
    }
    if (models.publication.publication_identifiers) {
      models.publication.publication_identifiers.forEach(function (identifierObj) {
        if (identifierObj.identifier_code === 'doi') {
          headTags.push({type: 'meta', attrs: {name: 'citation_doi', content: identifierObj.identifier_value}});
        }
      });
    }
    if (models.publication.authors) {
      models.publication.authors.forEach(function (authorObj) {
        var authorName = [authorObj.first_name, authorObj.last_name].join(" ").trim();
        headTags.push({type: 'meta', attrs: {name: 'citation_author', content: authorName}});
      });
    }
    if (models.publication.files) {
      models.publication.files.forEach(function (fileObj) {
        headTags.push({type: 'meta', attrs: {name: 'citation_pdf_url', content: ENV.APP.fileURL + '/'+ fileObj.id}});
      });
    }

    this.set('headTags', headTags);
  }
});
