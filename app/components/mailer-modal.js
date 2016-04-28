import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  actions: {
    sendMail: function(){
      var publication = this.get('publication');
      var message = this.get('message');
      this.store.save('feedback_mail',{message: message, from: 'from_person', publication_id: publication.id}).then(
        function(response){
        },
        function(error) {
        }
        );
    }
  }
});
