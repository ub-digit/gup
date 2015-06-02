import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');

  this.resource('publications', function() {
    this.route('show', {path: ":id"});
    this.route('index');
    this.route('manage', function() {
      this.route('new');
      this.route('fileimport');
      this.route('import');
      this.route('dashboard', function() {
        this.route('drafts');
        this.route("published");
        this.route("touched");
      });
      this.route('show', {path: 'show/:id'}, function() {
        this.route('edit');
      });
      this.route('publicationTypePicker');
      this.route('create');
    });
  });
});

export default Router;

