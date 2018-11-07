import Ember from 'ember';

export default Ember.Component.extend({
  isShowing: true,

  isFirst: Ember.computed('index', function() {
 	if (this.get("index") === 0) {
 		return "is-first";
 	}
 	return;
  }),
  isLast: Ember.computed('index', 'totalNumberOfLinks', function() {
  	if ((this.get("index")+1) === this.get('totalNumberOfLinks')) {
  		return 'is-last';
  	}
  	return;
  })
});
