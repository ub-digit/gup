import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return Ember.RSVP.hash({
	  drafts: this.store.find("draft"),
	  publications: this.store.find("publication")
	});
  },
});

