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
  model: null,

  yearRangeDepartments: Ember.computed('filter.{start_year,end_year}', function() {
    let startYear = this.get('filter.start_year') || '';
    let endYear = this.get('filter.end_year') || '';
    let validStartYear = validYear(startYear);
    let validEndYear = validYear(endYear);
    let departments = this.get('departments');
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

  selectableDepartments: Ember.computed('yearRangeDepartments', 'filter.{faculties}', function() {
    let departments = this.get('yearRangeDepartments');

    if (Ember.isPresent(this.get('filter.faculties'))) {
      let facultyId = this.get('filter.faculties');
      departments = departments.filter((item) => {
        return facultyId === item.faculty_id;
      });
    }

    if (Ember.isPresent(this.get('filter.departments'))) {
      let selectable_selected_departments = this.get('filter.departments').filter((department_id) => {
        return departments.findBy('id', department_id);
      });
      //If one or more selected department no longer among selectable, set new valid filtered selection
      if (this.get('filter.departments').length !== selectable_selected_departments.length) {
        this.set('filter.departments', selectable_selected_departments);
      }
    }
    return departments;
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
  hasFilterData: Ember.computed('filterData', function() {
    const filters = ['start_year', 'end_year', 'faculties', 'departments', 'publication_types', 'ref_value'];
    for (let i in filters) {
      if (Ember.isPresent(this.get('filterData.' + filters[i]))) {
        return true;
      }
    }
    return false;
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

  reportRows: Ember.computed('model.data[]', 'reportRowsColumns', function() {
    let rows = this.get('model.data');

    if (Ember.isEmpty(rows)) {
      return [];
    }
    let token = this.get("session.data.authenticated.token");
    //TODO: Nicer way to bake url?
    let url = ENV.APP.serviceURL + '/published_publications_xls/?token=' + token;
    let columns = this.get('reportRowsColumns');
    // TODO: put this somewhere else, or use lodash zipObject(?) "https://lodash.com/"
    /*
    let zipObject = function(keys, values) {
      return keys.reduce(function(result, key, index) {
        result[key] = values[index];
        return result;
      }, {});
    };
    */
    return rows.map(function(row) {
      let rowObject = Ember.Object.create();
      rowObject.set('columns', row.map((item) => { return Ember.typeOf(item) === 'array' ? item[0] : item; }));
      let columnsQuery = columns.reduce((query, column, index) => {
        let colValue = row[index];
        query += '&' + column + '=' + (Ember.typeOf(colValue) === 'array' ? colValue[1] : colValue);
        return query;
      }, '');
      rowObject.set('xls_url', url + columnsQuery);
      return rowObject;
    });
  }),
  hasReportRows: Ember.computed.notEmpty('reportRows'),
  //Somehow this messes with vim auto-indent :(, so putting it last
  selectableFaculties: Ember.computed('yearRangeDepartments', 'publicationsController.faculties', function() {
    // TODO: this could be computed prop for increased performance
    let facultyIds = this.get('yearRangeDepartments').reduce((result, department) => {
      result[department.faculty_id] = department.faculty_id;
      return result;
    }, []);
    let faculties = this.get('publicationsController.faculties');
    return facultyIds.map(function(id) {
      //TODO: this could be made much faster by indexing faculties by id instead
      return faculties.findBy('id', id) || Ember.Object.create({
        id: id,
        name: 'Unknown/Extern (id: ' + id + ')'
      });
    });
  }),
});
