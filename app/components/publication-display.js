import Ember from 'ember';


export default Ember.Component.extend({

  classNames: ['publication-display'],

  classNameBindings: ['isReviewMode:publication-review-list', 'isPreviewMode:publication-preview-list'],

  isReviewMode: Ember.computed.equal('mode', 'review'),
  isPreviewMode: Ember.computed.equal('mode', 'preview'),
  isCompareMode: Ember.computed.equal('mode', 'compare'),

  allFieldObjects: Ember.computed('publicationType.all_fields', function() {
    var o = Ember.Object.create();
    if (this.get('publicationType.all_fields')) {
      this.get('publicationType.all_fields').forEach(function(field) {
        Ember.set(o, field.name, field);
      });
    } 
    return o;
  }),
  comparableVersions: Ember.computed('publication.versions', function() {
    var versions = this.get('publication.versions').slice(1);
    return versions.map(function(item,i) {
      return {index: (versions.length - i), item: item};
    });
  }),
  fetchVersionString: 'fetchVersion',

  refreshModelAction: 'refreshModel',

  actions: {
    refreshModel: function() {
      this.sendAction('refreshModelAction', this.get('publication.id'));
    },
    fetchVersion: function(version_id) {
      this.sendAction('fetchVersionString', this.get('publication.id'), version_id);
    }
  }
});
