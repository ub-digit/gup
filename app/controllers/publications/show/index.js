import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],

  actions: {
    goBack: function() {
      var target = this.get('controllers.application.currentList') || 'publications.dashboard.drafts';
      this.transitionToRoute(target);
    }
  }
});
