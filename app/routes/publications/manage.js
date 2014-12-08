import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
//    return this.store.find('draft');


    return Ember.RSVP.hash({
	  drafts: this.store.find("draft"),
	  publications: this.store.find("publication")
	});
  },
});

