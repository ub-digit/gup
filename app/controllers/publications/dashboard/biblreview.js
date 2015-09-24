import Ember from 'ember';

export default Ember.Controller.extend({
    pubyear: 0,
    page: 1,
    queryParams: ['pubyear','pubtype','page'],
    needs: ['publications']
});



