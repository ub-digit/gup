import Ember from 'ember';

export default Ember.Component.extend({
  getConfigMetaForField: function() {
     var fullObject = this.get("selectedPublicationType");
     if (fullObject) {
        var logicForField = fullObject.all_fields.findBy('name',this.get("fieldName"));
        if (!logicForField) {
        	return null;
        }
        if (logicForField.rule) {
          return logicForField.rule;
        }
        else {
          return null;
        }
      }
      else { // if no object was found 
        return null;
      }
  }.observes('selectedPublicationType'),

  isMandatory: function() {
    var rule = this.getConfigMetaForField();
    if (rule === 'R') {
      return true;
    }
    else {
      return false;
    } 
  }.property('selectedPublicationType'),

  isVisible: function() {
    var rule = this.getConfigMetaForField();
    if (rule) {
    	if (rule === "n/a") {
    		return false;
    	}
    	else {
    		return true;
    	}
    }
    else {
    	false;
    }
  }.property('selectedPublicationType'),

  isTypeTextarea: function() {
  	if (this.get("type") === "textarea") {
		return true;
  	}
  	else {
  		return false;
  	}

  }.property('type'),

  isTypeText: function() {
  	if (this.get("type") === "text") {
		return true;
  	}
  	else {
  		return false;
  	}
  }.property('type'),



});
