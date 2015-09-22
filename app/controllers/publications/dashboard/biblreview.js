import Ember from 'ember';

export default Ember.Controller.extend({
    pubyear: 0,
    queryParams: ['pubyear','pubtype'],
    pubtypes: ['alla typer','journal-articles', 'review-articles', 'editorial-letters', 'book-reviews', 'magazine-articles', 'books', 'book-chapters', 'translations', 'doctoral-thesis', 'reports', 'conference-papers', 'conference-contributions', 'edited-book', 'report-chapter', 'newspaper-article', 'encyclopedia-entry', 'licentiate-thesis', 'journal-issue', 'poster', 'proceeding', 'patent', 'working-paper','original-creative-work','curated-exhibition','other'],
    pubyears: [
      {pubyear:'alla år', id: 0},
      {pubyear:'2015 eller senare', id: 1},
      {pubyear:'2014', id:2014},
      {pubyear:'2013', id:2013},
      {pubyear:'2012', id:2012},
      {pubyear:'2011', id:2011},
      {pubyear:'2010 eller tidigare', id:-1}
      ]
});



