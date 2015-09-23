import Ember from 'ember';

export default Ember.Controller.extend({
    pubyear: 0,
    queryParams: ['pubyear','pubtype'],
    needs: ['application']
});



