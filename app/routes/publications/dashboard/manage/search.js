import Ember from 'ember';

export default Ember.Route.extend({
    i18n: Ember.inject.service(),
    titleToken: function() {
        return this.get("i18n").t('publications.dashboard.manage.search.title');
    },
    queryParams:{
        page:{refreshModel: true},
        search_term:{refreshModel: true}
    },
    afterModel: function(transition) {
        this.controllerFor('application').set('currentList', transition.targetName);
    },
    model: function(params){
        return this.store.find("publication_record", params);
    },
    setupController: function(controller, model) {
        controller.set("model", model);
        controller.set("manageController.isNavVisible", true);
    },
    resetController: function(controller, isExiting, transition) {
        this._super.apply(this, arguments);

        if (isExiting) {
            controller.resetData();
        }
    }
});
