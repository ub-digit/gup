import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('publications', function() {
    this.route('show', {path: ":id"});
    this.route('new');
    this.route('index');
    this.route('manage', function() {
      this.route('show', {path: ':id'}, function() {
        this.route('edit');
      });      
    });
  });
  });

export default Router;

