import Ember from 'ember';
import ENV from 'gup/config/environment';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  publicationsController: Ember.inject.controller("publications"),
  publicationTypes: [],
  person: null,
  columns: {},
  filter: {},
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
