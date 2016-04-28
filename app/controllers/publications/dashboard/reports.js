import Ember from 'ember';
import ENV from 'gup/config/environment';

export default Ember.Controller.extend({
  publicationsController: Ember.inject.controller("publications"),
  publicationTypes: [],
  columns: {},
  content_type: {},
  filter: {},
  columnArray: Ember.computed('columns.{year,faculty,department,publication_type,content_type}', function() {
    var cArray = [];
    if(this.get('columns.year')) { cArray.push('year'); }
    if(this.get('columns.faculty')) { cArray.push('faculty_id'); }
    if(this.get('columns.department')) { cArray.push('department_id'); }
    if(this.get('columns.publication_type')) { cArray.push('publication_type'); }
    if(this.get('columns.content_type')) { cArray.push('content_type'); }
    return cArray;
  }),
  filterData: Ember.computed('filter.{start_year,end_year,faculties,departments,publication_types,content_types}', 'content_type.{ref,vet,pop}','publicationTypes.@each.checked', function() {
    var content_types = [];
    if(this.get('content_type.ref')) { content_types.push('ref'); }
    if(this.get('content_type.vet')) { content_types.push('vet'); }
    if(this.get('content_type.pop')) { content_types.push('pop'); }
    this.set('filter.content_types', content_types);

    var publication_types = [];
    this.get('publicationTypes').forEach(function(item) {
      if(item.checked) {
        publication_types.push(item.code);
      }
    });
    this.set('filter.publication_types', publication_types);
    
    return this.get('filter');
  }),

  csvUrl: Ember.computed('columnArray', 'filterData', function() {
    var that = this;
    var date = moment();
    var report_name = "report-"+date.format("YYYY-MM-DD_HHMM");
    var token =  this.container.lookup('simple-auth-session:main').get('token');
    var report_data = Ember.$.param({
      report: {
        filter: that.get('filterData'),
        columns: that.get('columnArray')
      }
    });
    return ENV.APP.serviceURL + '/reports/' + report_name + '?token=' + token + '&' + report_data;
  }),

  
  model: {}
});
