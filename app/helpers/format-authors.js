import Ember from 'ember';

export function formatAuthors([authors]) {
  return authors.map((author) => {
    return [author.first_name, author.last_name]
      .map((name) => { return Ember.isPresent(name) ? name : null; })
      .compact()
      .join(' ');
  }).join(', ');
}

export default Ember.Helper.helper(formatAuthors);
