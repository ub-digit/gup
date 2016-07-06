import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'span',
  authorsString: Ember.computed('authors', function(){
    var string = '';
    this.get('authors').forEach(function(author, index){
      var currentAuthorString = author.first_name + ' ' + author.last_name;
      if (index === 0)
      {
        string += currentAuthorString;
      }
      else
      {
        string += ", " + currentAuthorString;      	
      }
    });
    return string;
  })
});
