import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('collapsible-items', 'Integration | Component | collapsible items', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.render(hbs`{{collapsible-items}}`);
  assert.equal(this.$().text().trim(), '');
});

test('it works', function(assert) {
  this.set('items', ['Item 1', 'Item 2']);
  // Template block usage:
  this.render(hbs`
    {{#collapsible-items items=items as |item collapsibleItem|}}
      <button class="toggle-item-{{collapsibleItem.index}}" {{action collapsibleItem.toggleIsActive}}>Toggle text</button>
      {{#if collapsibleItem.isActive}}{{item}}{{/if}}
    {{/collapsible-items}}
  `);
  // Should not display any items
  assert.equal(this.$(":contains('Item')").length, 0, "All items collapsed");

  // Toggle visible
  this.$('.toggle-item-0').click();
  assert.equal(this.$(":contains('Item 1')").length, 1, "First item expanded");

  // Toggle hidden
  this.$('.toggle-item-0').click();
  assert.equal(this.$(":contains('Item 1')").length, 0, "First item collapsed");

  //TODO: Test accordion behavior
});

