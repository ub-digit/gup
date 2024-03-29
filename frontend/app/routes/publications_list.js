import Ember from 'ember';


export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  titleToken: function() {
    return this.get("i18n").t('publications_list.title_page');
  },
  queryParams:{
    page: { refreshModel: true },
    sort_by: { refreshModel: true },

    publication_id: { refreshModel: true },
    person_id: { refreshModel: true },
    department_id: { refreshModel: true },
    faculty_id: { refreshModel: true },
    serie_id: { refreshModel: true },
    project_id: { refreshModel: true },
    publication_type: { refreshModel: true },
    ref_value: { refreshModel: true },
    start_year: { refreshModel: true },
    end_year: { refreshModel: true },
    only_artistic: { refreshModel: true },
  },
  afterModel: function(model, transition) {
    this.controllerFor('application').set('currentList', transition.targetName);
  },
  model: function(params){
    if(!params.page) {
      params.page = 1;
    }
    let strSolrFormat = "";
    if (params.person_id && params.person_id.length) {
      strSolrFormat = params.person_id.replace(/;/g, " OR ");
    }

    this.set("selectedFacultyID", null);
    if (params.faculty_id) {
      this.set("selectedFacultyID", params.faculty_id);
    }


    this.set("selectedSerieIDS", null);
    if (params.serie_id && params.serie_id.length) {
      // add selected departments to selected departemts
      let arr = params.serie_id.split(';');
      this.set("selectedSerieIDS", arr);
    }

    this.set("selectedDepartmentIDS", null);
    if (params.department_id && params.department_id.length) {
      // add selected departments to selected departemts
      let arr = params.department_id.split(';');
      this.set("selectedDepartmentIDS", arr);
    }
    this.set("selectedPublicationTypeIDS", null);
    if (params.publication_type && params.publication_type.length ) {
      let arr = params.publication_type.split(';');
      this.set('selectedPublicationTypeIDS', arr);
    }
    this.set("selectedProjectIDS", null)
    if (params.project_id && params.project_id.length ) {
      let arr = params.project_id.split(';');
      this.set('selectedProjectIDS', arr);
    }
    return Ember.RSVP.hash({
      publicList: this.store.find('public_publication_list', params),
      departments: this.store.find('department'),
      series: this.store.find('serie'),
      projects: this.store.find('project'),
      publicationTypes: this.store.find('publication_type'),
      faculties: this.store.find('faculty'),
      selectedAuthors:  this.store.find('person_record', {search_term: "id:("+strSolrFormat+")"})
    });
  },
  setupController: function(controller, model) {
    controller.set("base_end_year" ,new Date().getFullYear() + 10);
    controller.set('model', model.publicList);
    controller.set('projects', model.projects);
    controller.set('series', model.series);
    controller.set('departments', model.departments);
    controller.set('faculties', model.faculties);
    controller.set('publicationTypes', model.publicationTypes);
    if ((controller.get('selectedAuthors').length === 0) && (model.selectedAuthors.length !== 0)) {
        controller.set('selectedAuthors', model.selectedAuthors);
    }

    if (this.get('selectedFacultyID')) {
      controller.set('selectedFacultyID', parseInt(this.get('selectedFacultyID')));
    }



    if (controller.get('selectedSeries').length === 0) {
      let seriesArr = [];
      if (this.get('selectedSerieIDS')) {
        this.get('selectedSerieIDS').forEach(function(id) {
          seriesArr.pushObject(controller.get("series").findBy('id', parseInt(id)));
        });
        controller.set('selectedSeries', seriesArr);
      }
      seriesArr = [];
    }
    if (controller.get('selectedDepartments').length === 0) {
      let departmentsArr = [];
      if (this.get('selectedDepartmentIDS')) {
        this.get('selectedDepartmentIDS').forEach(function(id) {
          departmentsArr.pushObject(controller.get("departments").findBy('id', parseInt(id)));
        });
        controller.set('selectedDepartments', departmentsArr);
      }
      departmentsArr = [];
    }

    if (controller.get('selectedProjects').length === 0) {
      let projectsArr = [];
      if (this.get('selectedProjectIDS')) {
        this.get('selectedProjectIDS').forEach(function(id) {
          projectsArr.pushObject(controller.get("projects").findBy('id', parseInt(id)));
        });
        controller.set('selectedProjects', projectsArr);
      }
      projectsArr = [];
    }

    if (controller.get('selectedPublicationTypes').length === 0) {
      let publicationTypeArr = [];
      if (this.get('selectedPublicationTypeIDS')) {
        this.get('selectedPublicationTypeIDS').forEach(function(id) {
          publicationTypeArr.pushObject(controller.get("publicationTypes").findBy('id', parseInt(id)));
        });
        controller.set('selectedPublicationTypes', publicationTypeArr);
      }
      publicationTypeArr = [];
    }

    if (controller.get('sortSelectValues').length === 0) {
      controller.get('sortSelectValues').pushObjects([
          { value: 'pubyear', label: this.get("i18n").t('publications_list.sortByYearLabel') },
          { value: 'title', label: this.get("i18n").t('publications_list.sortByTitleLabel') },
          { value: 'pubtype', label: this.get("i18n").t('publications_list.sortByPubTypeLabel') },
          { value: 'first_author', label: this.get("i18n").t('publications_list.sortByFirstAuthorLabel') }
      ]);
    }
  }
});
