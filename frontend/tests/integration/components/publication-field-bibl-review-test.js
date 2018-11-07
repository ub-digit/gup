import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('publication-field-bibl-review', 'Integration | Component | publication field bibl review', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{publication-field-bibl-review}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#publication-field-bibl-review}}
      template block text
    {{/publication-field-bibl-review}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
