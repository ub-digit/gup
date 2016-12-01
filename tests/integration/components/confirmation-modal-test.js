import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';

moduleForComponent('confirmation-modal', 'Integration | Component | confirmation modal', {
  integration: true
});

test('it works', function(assert) {
  assert.expect(4);

  this.set('isShowingModal', false);
  this.set('didConfirmAction', () => {
    this.set('didConfirmActionCalled', true);
    return Ember.RSVP.Promise.resolve();
  });
  this.render(hbs`
    {{#confirmation-modal isShowing=isShowingModal didConfirm=(action didConfirmAction)}}
      template block text
    {{/confirmation-modal}}
  `);

  assert.ok(this.$('.modal').is(':hidden'), 'Modal is not visible if not showing');

  this.set('isShowingModal', true);

  //Wait for modal animation to complete
  return wait().then(() => {
    // @TODO: GET THIS WORKING, problem with wait????
    //assert.ok(this.$('.modal').is(':visible'), 'Modal is visible if showing');

    assert.equal(this.$('.modal-body').text().trim(), 'template block text', 'Modal body contains block text');

    // @TODO: .btn-primary is a bit fragile, but ok. Add classes in component?
    this.$('.btn-primary').click();
    assert.ok(this.get('didConfirmActionCalled'), 'didConfirm action was called when clicking acccept button');

    this.$('.close').click();
    return wait().then(() => {
      assert.ok(this.$('.modal').is(':hidden'), 'Modal is not visible after clicking close button');
    });
    //TODO: also click cancel button?
  });
});
