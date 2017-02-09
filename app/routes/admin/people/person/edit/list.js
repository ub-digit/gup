import Ember from 'ember';

export default Ember.Route.extend({
	i18n: Ember.inject.service(),
	queryParams:{
		page: { refreshModel: true },
		sort_by: { refreshModel: true },
		publication_id: { refreshModel: true },
		person_id: { refreshModel: true },
		department_id: { refreshModel: true },
		faculty_id: { refreshModel: true },
		serie_id: { refreshModel: true },
		project_id: { refreshModel: true },
		publication_type: { refreshModel: true },
		ref_value: { refreshModel: true },
		start_year: { refreshModel: true },
		end_year: { refreshModel: true }
	},

	model: function(params) {
		let myModel = this.modelFor('admin.people.person.edit');
		params.person_id = myModel.id;

		return Ember.RSVP.hash({
	      person : this.store.find('person_record', {search_term: params.person_id, ignore_affiliation: false}),
	      model: this.store.find('public_publication_list', params)
    	});

		myPerson = this.store.find('person', params.person_id);
		return this.store.find('public_publication_list', params);
	},
	setupController: function(controller, model) {
		this.controller.set("model", model.model);
		this.controller.set("person", model.person);
		if (controller.get('sortSelectValues').length === 0) {
	  controller.get('sortSelectValues').pushObjects([
	      { value: 'pubyear', label: this.get("i18n").t('publications_list.sortByYearLabel') },
	      { value: 'title', label: this.get("i18n").t('publications_list.sortByTitleLabel') }
	  ]);
	}
}
});
