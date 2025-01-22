import Ember from 'ember';
import ENV from 'frontend/config/environment';
import { validYear } from 'frontend/lib/validations';

export default Ember.Controller.extend({
	i18n: Ember.inject.service(),
  session: Ember.inject.service('session'),
  	page: 1,
  	queryParams: ['page', 'sort_by', 'publication_id', 'person_id', 'department_id', 'faculty_id', 'serie_id', 'project_id', 'publication_type', 'ref_value', 'start_year', 'end_year', 'only_artistic'],
  	sortSelectValues: Ember.A([]),
  	sort_by: 'pubyear',
  	publication_id: null,
    person_id: "",
    department_id: null,
    faculty_id: null,
    serie_id: null,
    project_id: null,
    publication_type: null,
    ref_value: null,
    start_year: null,
    end_year: null,
    only_artistic: false,

    selectedFacultyID: null,
    selectedSeries: [],
    selectedProjects: [],
    selectedDepartments: [],
    selectedAuthors: [],
    selectedPublicationTypes: [],
    isRef: false, // translate to ISREF/NOTREF in queryparam ref_value
    isArtistic: false,
    base_start_year: 1942,
    base_end_year: null, // is set in setupController


    resetPaging: Ember.observer("selectedPublicationTypes", "selectedProjects", "selectedSeries", "selectedFacultyID", "selectedAuthors", "selectedDepartments", "isRef", "start_year", "end_year", "isArtistic", function() {
      this.set("page", 1);
    }),

    resultIsVisible: Ember.computed("selectedPublicationTypes", "selectedProjects", "selectedSeries", "selectedFacultyID", "selectedAuthors", "selectedDepartments", "isRef", "start_year", "end_year", "isArtistic", function() {
      return true; // simple fix for now. We need to always display results from start for indexing in google scholar
      //if (this.get("person_id") || this.get("department_id") || this.get("ref_value") || this.get("start_year") || this.get("end_year")) {
      //  return true;
      //}
      //return false;
    }),

    getDownloadLink: Ember.computed("selectedPublicationTypes", "selectedProjects", "selectedSeries", "selectedFacultyID", "selectedAuthors", "selectedDepartments", "isRef", "start_year", "end_year", "isArtistic", function(){
      return encodeURI(ENV.APP.serviceURL + "/public_publication_lists"
          + "?sortby=" + this.get("sort_by")
          + "&publication_id=" + ((this.get("publication_id")) ? this.get("publication_id") : '')
          + "&person_id=" + ((this.get("person_id")) ? this.get("person_id") : '')
          + "&department_id=" + ((this.get("department_id")) ? this.get("department_id") : '')
          + "&faculty_id=" + ((this.get("faculty_id")) ? this.get("faculty_id") : '')
          + "&serie_id=" + ((this.get("serie_id")) ? this.get("serie_id") : '' )
          + "&project_id=" + ((this.get("project_id")) ? this.get("project_id") : '')
          + "&publication_type=" + ((this.get("publication_type")) ? this.get("publication_type") : '')
          + "&ref_value=" + ((this.get("ref_value")) ? this.get("ref_value") : '')
          + "&start_year=" + ((this.get("start_year")) ? this.get("start_year") : '')
          + "&end_year=" + ((this.get("end_year")) ? this.get("end_year") : '')
          + "&only_artistic=" + ((this.get("only_artistic")) ? this.get("only_artistic") : '')
          + "&output=ris");
    }),

    getMaxNumberOfDownloads: Ember.computed('model', function() {
      return ENV.APP.GUP_MAX_NUMBER_OF_POSTS_RIS;
    }),

    disableDownloadAsEndnote: Ember.computed("model.meta.query.total", function() {
      return this.get("model.meta.query.total") > parseInt(ENV.APP.GUP_MAX_NUMBER_OF_POSTS_RIS);
    }),

    getLink: Ember.computed("session", function() {
      if (this.get("session.isAuthenticated")) {
        return "publications.dashboard.manage.show";
      }
      return "publication";
    }),

    selectedFacultyChanged: Ember.observer('selectedFacultyID', function(){
      this.set('faculty_id', this.get('selectedFacultyID'));
    }),

    selectedSeriesChanged: Ember.observer('selectedSeries', function(){
      this.formatForQueryStr('serie_id', this.get('selectedSeries'));
    }),

    selectedProjectsChanged: Ember.observer('selectedProjects', function(){
      this.formatForQueryStr('project_id', this.get('selectedProjects'));
    }),

    selectedPublicationTypesChanged: Ember.observer('selectedPublicationTypes', function() {
      this.formatForQueryStr('publication_type', this.get('selectedPublicationTypes'));
    }),

    selectedDepartmentsChanged: Ember.observer('selectedDepartments', function() {
      this.formatForQueryStr('department_id', this.get('selectedDepartments'));
    }),

    selectedAuthorsChanged: Ember.observer('selectedAuthors', function() {
      this.formatForQueryStr('person_id', this.get('selectedAuthors'));
    }),

    isRefValueChanged: Ember.observer('ref_value', function() {
      if (this.get("ref_value") !== 'ISREF'){
        this.set("isRef", false);
      }
      else {
        this.set("isRef", true);
      }
    }),

    isArtisticValueChanged: Ember.observer('isArtistic', function() {
      this.set('only_artistic', this.get('isArtistic'));
    }),

    yearRangeDepartments: Ember.computed('start_year', 'end_year', function() {
      let startYear = this.get('start_year') || '';
      let endYear = this.get('end_year') || '';
      let validStartYear = validYear(startYear);
      let validEndYear = validYear(endYear);
      let departments = this.get('departments');

      // TODO: Validations not needed
      if (validStartYear) {
        startYear = parseInt(startYear);
        departments = departments.filter((item) => {
          return !Ember.isPresent(item.end_year) || item.end_year >= startYear;
        });
      }
      if (validEndYear) {
        endYear = parseInt(endYear);
        departments = departments.filter((item) => {
          return !Ember.isPresent(item.start_year) || item.start_year <= endYear;
        });
      }
      return departments;
    }),

    selectableFaculties: Ember.computed('yearRangeDepartments', function() {
      // @TODO: this could be computed prop for increased performance
      let facultyIds = this.get('yearRangeDepartments').reduce((result, department) => {
        result[department.faculty_id] = department.faculty_id;
        return result;
      }, []);
      let faculties = this.get('faculties');
      return facultyIds.map(function(id) {
        //TODO: this could be made much faster by indexing faculties by id instead
        return faculties.findBy('id', id) || Ember.Object.create({
          id: id,
          name: 'Unknown/Extern (id: ' + id + ')'
        });
      });
    }),

    selectableDepartments: Ember.computed('yearRangeDepartments', 'selectedFacultyID', function() {
      let departments = this.get('yearRangeDepartments');

      // TODO: Should document: why do we do this?
      departments.forEach((item) => {
        item.children = null;
      });

      // remove here
      if (Ember.isPresent(this.get('selectedFacultyID'))) {
        let facultyId = this.get('selectedFacultyID');
        departments = departments.filter((item) => {
          return facultyId === item.faculty_id;
        });
      }

      if (Ember.isPresent(this.get('selectedDepartments'))) {
        let selectable_selected_departments = this.get('selectedDepartments').filter((department) => {
          return departments.findBy('id', department.id);
        });
        //If one or more selected department no longer among selectable, set new valid filtered selection
        if (this.get('selectedDepartments').length !== selectable_selected_departments.length) {
          this.set('selectedDepartments', selectable_selected_departments);
        }
      }


      return departments;
    }),

    isRefChanged: Ember.observer('isRef', function() {
      if (this.get("isRef")) {
        this.set("ref_value", "ISREF");
      }
      else {
        this.set("ref_value", null);
      }
    }),

    rangeYear: Ember.computed('base_start_year', 'base_end_year', function() {
      let arr = [];
      for (var i = this.get("base_start_year"); i < this.get("base_end_year"); i++) {
          arr[i] = i.toString();
      }
      return arr;
    }),

    formatForQueryStr(name, selectedValues) {
      // takes array and formats to semicolon separated string
      this.set(name, selectedValues.mapBy("id").join(";"));
    },

    actions: {
      searchAuthor(term) {
        return this.store.find('person_record', {search_term: term});
      },
      searchDepartment(term) {
        return this.store.find('department', {search_term: term});
      }
    }
});
