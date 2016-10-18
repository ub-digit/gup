import Ember from 'ember';

export default Ember.Controller.extend({
    i18n: Ember.inject.service(),
    publicationsController: Ember.inject.controller('publications'),
    pubyear: 0,
    pubtype: null,
    faculty: null,
    page: 1,
    queryParams: ['faculty', 'pubyear', 'pubtype', 'page', 'only_delayed'],
    only_delayed: false,
    pubyears: Ember.computed(function(){
      return [
        {pubyear: this.get('i18n').t('publications.dashboard.biblreview.selectPublicationYearPrompt'), id: 0},
        {pubyear: moment().year()   + ' ' + this.get('i18n').t('publications.dashboard.biblreview.orLater'), id: 1},
        {pubyear: moment().year()-1, id:moment().year()-1},
        {pubyear: moment().year()-2, id:moment().year()-2},
        {pubyear: moment().year()-3, id:moment().year()-3},
      ];
    }),

    // Id must be a string to be compared with a value from query params
    faculties: Ember.computed('publicationsController.faculties', function() {
      return this.get('publicationsController.faculties').map(function(item){
        return {id: '' + item.id, name: item.name};
      });
    }),
    pubtypes: Ember.computed('publicationsController.publicationTypes', function() {
      return this.get('publicationsController.publicationTypes').map(function(item){
        return {id: '' + item.id, name: item.name};
      });
    })
});



