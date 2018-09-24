import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

var server;

const sessionStub = Ember.Service.extend({
  session: {data: {authenticated: {token: 'dummy-token' }}},
});

function createFile(content = ['test'], options = {}) {
  const {
    name,
    type
  } = options;

  const file = new Blob(content, {type : type ? type : 'text/plain'});
  file.name = name ? name : 'test.txt';

  return file;
}

moduleForComponent('file-upload', 'Integration | Component | file upload', {
  integration: true,
  beforeEach() {
    this.register('service:session', sessionStub);
    this.inject.service('session');
    this.inject.service('session', {as : 'session'});
  },
  setup() {
    this._super(...arguments);
    server = new Pretender(function() {
      this.post('/file', function(request) {
        return [200, {'Content-Type': 'application/json'}, JSON.stringify({success : true})];
      });
    });
  },
  teardown() {
    this._super(...arguments);
    server.shutdown();
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  //
  //const file = createFile
  this.render(hbs`{{file-upload}}`);
  assert.equal(this.$().text().trim(), '');
});
