import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('publication', {path: 'publication/:id'});
  this.route('publications_list', {path: 'publications/list'});
  this.route('publications', function() {
    this.route('dashboard', {path: '/'}, function() {
      this.route('manage', {path: '/'}, function() {
        this.route('start');
        this.route('drafts');
        this.route('search');
        this.route("published");
        this.route('new');
        this.route('show', {path: 'show/:id'}, function() {
          this.route('edit');
        });
        this.route('file_imports', {path: 'uploaded-lists'});
      });
      this.route("touched");
      this.route('review');
      this.route('biblreview');
      this.route('reports');
    });
  });
  this.route('admin', function() {
    this.route('departments', function(){
      this.route('index', {path: '/'});
      this.route('new');
    });
    this.route('people', function() {
      this.route('person', function() {
        this.route('edit', {path: 'edit/:id'}, function() {
          this.route('list', {path: '/'});
        });
      });
    });

    this.route('messages');
  });
  this.route('page-not-found', { path: '/*wildcard' });
});

export default Router;

