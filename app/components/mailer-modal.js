import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    sendMail: function(){
      var setMsgHeaderAction = 'setMsgHeader';
      var that = this;
      var publication = this.get('publication');
      var message = this.get('message');
      var from = this.get('from');
      this.store.find('feedback_email', publication.id, {message: message, from: 'from_person'}).then(
        function(response){
        },
        function(error) {
        }
        );
    }
  }
});
