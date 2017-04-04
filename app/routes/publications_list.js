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
    end_year: { refreshModel: true }
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
    this.set("selectedDepartmentIDS", null);
    if (params.department_id && params.department_id.length) {
      // add selected departments to selected departemts
      let arr = params.department_id.split(';');
      this.set("selectedDepartmentIDS", arr);
    }

    return Ember.RSVP.hash({
      publicList: this.store.find('public_publication_list', params),
      departments: this.store.find('department', {brief: true }),
      selectedAuthors:  this.store.find('person_record', {search_term: "id:("+strSolrFormat+")"})
    });
  },
  setupController: function(controller, model) {
    controller.set("base_end_year" ,new Date().getFullYear() + 10);
    controller.set('model', model.publicList);
    controller.set('departments', model.departments);
    if (controller.get('selectedAuthors').length === 0) {
        controller.set('selectedAuthors', model.selectedAuthors);
    }

    if (controller.get('selectedDepartments').length === 0) {
      let departmentsArr = [];
      if (this.get('selectedDepartmentIDS')) {
        this.get('selectedDepartmentIDS').forEach(function(id) {
          departmentsArr.pushObject(controller.get("departments").findBy('id', parseInt(id)));
        })
        controller.set('selectedDepartments', departmentsArr);
      }
      departmentsArr = [];
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
