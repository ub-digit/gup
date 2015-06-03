import Ember from 'ember';
import ResetScroll from 'gup/mixins/resetscroll';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin,ResetScroll, {
  model: function(params){
    return this.store.find('publication',params.id);
  },
  actions: {
    refreshModel: function(modelId) {
      this.refresh(modelId);
    }
  }
});

