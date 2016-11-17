import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('confirmation-modal-button', 'Integration | Component | confirmation modal button', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{confirmation-modal-button}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#confirmation-modal-button}}
      template block text
    {{/confirmation-modal-button}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
