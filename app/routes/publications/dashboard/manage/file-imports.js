import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    //return this.store.find('endnote_import');
    return Promise.resolve(Ember.A([Ember.Object.create({
      'id': 123,
      'name': 'Web of Scence Alert 160916.xml',
      'imported_date': '2016-09-16 10:53:36',
      'publications': [{
        'name': 'Supply chain...',
        'id': 'https://doi.org/101109.77073',
        'imported': false,
      },
      {
        'name': 'Supply chain...',
        'id': 'https://doi.org/101109.77073',
        'imported': false,
      },
      {
        'name': 'Supply chain...',
        'id': 'https://doi.org/101109.77073',
        'imported': true,
      }]
    }),
    Ember.Object.create({
      'id': 124,
      'name': 'Web of Scence Alert 160917.xml',
      'imported_date': '2016-09-16 10:53:37',
        'publications': [{
          'name': 'Supply chain...',
          'id': 'https://doi.org/101109.77073',
          'imported': false,
        },
        {
          'name': 'Supply chain...',
          'id': 'https://doi.org/101109.77073',
          'imported': true,
        },
        {
          'name': 'Supply chain...',
          'id': 'https://doi.org/101109.77073',
          'imported': false,
        }]
    })]));
  }
});
