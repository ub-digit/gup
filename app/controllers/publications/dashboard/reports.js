import Ember from 'ember';
import ENV from 'gup/config/environment';
import { validYear } from 'gup/lib/validations';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  publicationsController: Ember.inject.controller('publications'),
  publicationTypes: [],
  person: null,
  columns: {},
  filter: {},

  yearRangeDepartments: Ember.computed('filter.{start_year,end_year}', function() {
    let startYear = this.get('filter.start_year') || '';
    let endYear = this.get('filter.end_year') || '';
    let validStartYear = validYear(startYear);
    let validEndYear = validYear(endYear);
    let departments = this.get('departments');
    if (validStartYear || validEndYear) {
      startYear = parseInt(startYear);
      endYear = parseInt(endYear);
      departments = departments.filter((item) => {
        return (
          !validStartYear ||
          Ember.isBlank(item.start_year) ||
          item.start_year >= startYear
        ) && (
          !validEndYear ||
          Ember.isBlank(item.end_year) ||
          item.end_year <= endYear
        );
      });
    }
    return departments;
  }),

  selectableDepartments: Ember.computed('yearRangeDepartments', 'filter.{faculties}', function() {
    let departments = this.get('yearRangeDepartments');

    //Temporary hack
    // @FIXME: Replace select2 component with something sane to
    // not have to deal with this

    // Include current selection to avoid weirdness
    if(Ember.isPresent(this.get('filter.departments'))) {
      let selected_departments = this.get('filter.departments').forEach((department_id) => {
        if (!departments.findBy('id', department_id)) {
          departments.pushObject(this.get('departments').findBy('id', department_id));
        }
      });
    }
    // End of hack

    if (Ember.isPresent(this.get('filter.faculties'))) {
      let facultyId = this.get('filter.faculties');
      departments = departments.filter((item) => {
        return facultyId === item.faculty_id;
      });
    }
    return departments;
  }),

  selectableFaculties: Ember.computed('selectableDepartments', 'filter.departments', 'publicationsController.faculties', function() {
    let facultyIds = Ember.isPresent(this.get('filter.departments')) ?
      this.get('filter.departments').map((department_id) => {
        return this.get('selectableDepartments').findBy('id', department_id).faculty_id;
      }) :
      this.get('selectableDepartments').reduce((result, department) => {
        result[department.faculty_id] = department.faculty_id;
        return result;
      }, []);
    let faculties = this.get('publicationsController.faculties');
    let tmp = facultyIds.map(function(id) {
      //TODO: this could be made much faster by indexing faculties by id instead
      return faculties.findBy('id', id);
    }); //.compact()?
    return tmp;
  }),

  columnArray: Ember.computed('columns.{year,faculty,department,publication_type,ref_value}', function() {
    var cArray = [];
    if(this.get('columns.year')) { cArray.push('year'); }
    if(this.get('columns.faculty')) { cArray.push('faculty_id'); }
    if(this.get('columns.department')) { cArray.push('department_id'); }
    if(this.get('columns.publication_type')) { cArray.push('publication_type_id'); }
    if(this.get('columns.ref_value')) { cArray.push('ref_value'); }
    return cArray;
  }),
  filterData: Ember.computed('filter.{start_year,end_year,faculties,departments,publication_types,ref_value}','publicationTypes.@each.checked', 'person.identifiers', function() {
    var that = this;

    var publication_types = [];
    this.get('publicationTypes').forEach(function(item) {
      if(item.checked) {
        publication_types.push(item.code);
      }
    });
    this.set('filter.publication_types', publication_types);
    if(this.get('person.identifiers')) {
      this.get('person.identifiers').forEach(function(identifier) {
        that.set('filter.persons', [identifier.value]);
      });
    }

    return this.get('filter');
  }),

  csvUrl: Ember.computed('columnArray', 'filterData', function() {
    var that = this;
    var date = moment();
    var report_name = "report-"+date.format("YYYY-MM-DD_HHMM");
    var token =  this.get("session.data.authenticated.token");
    var report_data = Ember.$.param({
      report: {
        filter: that.get('filterData'),
        columns: that.get('columnArray')
      }
    });
    return ENV.APP.serviceURL + '/reports/' + report_name + '?token=' + token + '&' + report_data;
  }),

  model: {},
});
