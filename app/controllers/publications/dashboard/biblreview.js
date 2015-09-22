import Ember from 'ember';

export default Ember.Controller.extend({
    pubyear: 0,
    queryParams: ['pubyear','pubtype'],
    pubtypes: ['alla typer','journal-articles', 'review-articles', 'editorial-letters', 'book-reviews', 'magazine-articles', 'books', 'book-chapters', 'translations', 'doctoral-thesis', 'reports', 'conference-papers', 'conference-contributions', 'edited-book', 'report-chapter', 'newspaper-article', 'encyclopedia-entry', 'licentiate-thesis', 'journal-issue', 'poster', 'proceeding', 'patent', 'working-paper','original-creative-work','curated-exhibition','other'],
    pubyears: [
      {pubyear: 'alla år', id: 0},
      {pubyear: moment().year()   + ' eller senare', id: 1},
      {pubyear: moment().year()-1, id:moment().year()-1},
      {pubyear: moment().year()-2, id:moment().year()-2},
      {pubyear: moment().year()-3, id:moment().year()-3},
      {pubyear: moment().year()-4, id:moment().year()-4},
      {pubyear: moment().year()-5 + ' eller tidigare', id:-1}
      ]
});



