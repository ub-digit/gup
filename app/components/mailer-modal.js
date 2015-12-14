import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  actions: {
    sendMail: function(){
      var publication = this.get('publication');
      var message = this.get('message');
      this.store.find('feedback_email', publication.id, {message: message, from: 'from_person'}).then(
        function(response){
        },
        function(error) {
        }
        );
    }
  }
});
