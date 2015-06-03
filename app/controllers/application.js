import Ember from 'ember';

export default Ember.Controller.extend({
    showMesg: function(newmesg) {
        newmesg = 'asdasd';
        $("#mesgdiv").find('span').html(newmesg);
        $("#mesgdiv").css("visibility", "visible");
    },
    hideMesg: function() {
        $("#mesgdiv").find('span').html('');
        $("#mesgdiv").css("visibility", "hidden");
    },


});
