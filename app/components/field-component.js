import Ember from 'ember';

export default Ember.Component.extend({
  getFullObject: function() {
     var fullObject = this.get("selectedPublicationType");
     if (fullObject) {
        var correctObjectBasedOnFieldName = fullObject.all_fields.findBy('name',this.get("fieldName"));
        if (!correctObjectBasedOnFieldName) {
          return null;
        }
        if (correctObjectBasedOnFieldName) {
          return correctObjectBasedOnFieldName;
        }
        else {
          return null;
        }
      }
      else { // if no object was found
        return null;
      }

  }.observes('selectedPublicationType'),


  getRule: function() {
    var fullObj = this.getFullObject();
    if (fullObj) {
      if (fullObj.rule) {
        return fullObj.rule;
      }
      else {
        return null;
      }
    }
    else {
      return null;
    }
  }.observes('selectedPublicationType'),

  getLabel: function() {

    if (this.get('label')) {
      return this.get('label');
    }

    var fullObj = this.getFullObject();
    if (fullObj) {
      if (fullObj.label) {
        return fullObj.label;
      }
      else {
        return null;
      }
    }
    else {
      return null;
    }
  }.property('selectedPublicationType'),

  isMandatory: function() {
    var rule = this.getRule();
    if (rule === 'R') {
      return true;
    }
    else {
      return false;
    }
  }.property('selectedPublicationType'),

  isVisible: function() {
    if (this.get('fieldName') === 'content_type') {
      return true;
    }

    var rule = this.getRule();
    if (rule) {
    	if (rule === "na") {
    		return false;
    	}
    	else {
    		return true;
    	}
    }
    else {
    	return false;
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

  isTypeCategorySelector: function() {
    return (this.get('type') === 'category-selector');
  }.property('type'),

  isTypeSelect: Ember.computed.equal('type', 'select')

});
