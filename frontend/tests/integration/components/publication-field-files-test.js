import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('publication-field-files', 'Integration | Component | publication field files', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{publication-field-files}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#publication-field-files}}
      template block text
    {{/publication-field-files}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
