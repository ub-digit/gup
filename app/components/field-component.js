import Ember from 'ember';

export default Ember.Component.extend({
  // Determines if input or presentation template should be used
  isPresentation: Ember.computed.equal('format', 'presentation'),
  isEditable: Ember.computed('isPresentation', function(){
    return !this.get('isPresentation');
  }),
  // Determines if all fields should be shown regardless of information
  isAdvanced: Ember.computed.equal('viewMode', 'advanced'),
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

  }.property('selectedPublicationType', 'fieldName'),


  getRule: function() {
    var fullObj = this.get('getFullObject');
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
  }.property('getFullObject'),

  getLabel: function() {

    if (this.get('label')) {
      return this.get('label');
    }

    var fullObj = this.get('getFullObject');
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
  }.property('getFullObject'),

  isMandatory: function() {
    
    var rule = this.get('getRule');
    if (rule === 'R') {
      return true;
    }
    else {
      return false;
    }
  }.property('getRule'),

  isVisible: function() {
    
    if (this.get('fieldName') === 'content_type') {
      return true;
    }

    var rule = this.get('getRule');
    if (rule) {
    	if (rule === "na") {
    	  return false;
    	}
    	else {
        if (this.get('isPresentation') && this.get('valueIsEmpty') && !this.get('isAdvanced')){
          return false;
        } else {
    		  return true;
        }
    	}
    }
    else {
    	return false;
    }
  }.property('getRule', 'isAdvanced', 'value', 'fieldName', 'isPresentation'),

  valueIsEmpty: Ember.computed('value', function(){
    if (!this.get('value')){
      return true;
    }
    if (this.get('value').constructor === Array && this.get('value').length < 1) {
      return true;
    }
    return false;
  }),

  initSourceTitleType: function(){
    if (this.get('type') !== 'journal'){
      return;
    }
    if (this.get('sourcetitle') && !this.get('journal_id')) {
      this.set('sourceTitleType', 'freetext');
    } else {
      this.set('sourceTitleType', 'journal');
    }
  }.on("init"),

  sourceTitleTypeJournal: Ember.computed.equal('sourceTitleType', 'journal'),
  sourceTitleTypeFreetext: Ember.computed.equal('sourceTitleType', 'freetext'),

	isTypeJournal: Ember.computed.equal('type', 'journal'),
	isTypeMultiSelect: Ember.computed.equal('type', 'multiselect'),
	isTypeText: Ember.computed.equal('type', 'text'),
	isTypeDate: Ember.computed.equal('type', 'date'),
	isTypeISSN: Ember.computed.equal('type', 'issn'),
	isTypeISBN: Ember.computed.equal('type', 'isbn'),
	isTypeTextarea: Ember.computed.equal('type', 'textarea'),
    isTypeCategorySelector: Ember.computed.equal('type', 'category-selector'),
    isTypeSelect: Ember.computed.equal('type', 'select'),
	
	showWarningSymbol: Ember.computed('isValidISSN', 'isValidISBN', function() {
		if(!this.get('isValidISSN')) {
			return true;
		}
		if(!this.get('isValidISBN')) {
			return true;
		}
		return false;
	}),

	isValidISSN: Ember.computed('isTypeISSN', 'value', function() {
		if(!this.get('isTypeISSN')) {
			return true;
		}
		var issn = this.get('value');
		if(!issn) {
			return true;
		}
		issn = issn.replace(/[^\dX]/gi, '');
		if(issn.length !== 8){
			return false;
		}
		var chars = issn.split('');
		if(chars[7].toUpperCase() === 'X'){
			chars[7] = 10;
		}
		var sum = 0;
		for (var i = 0; i < chars.length; i++) {
			sum += ((8-i) * parseInt(chars[i]));
		}
		return ((sum % 11) === 0);
	}),

	isValidISBN: Ember.computed('isTypeISBN', 'value', function() {
    var sum, weight, digit, check, i;

		if(!this.get('isTypeISBN')) {
			return true;
		}
		var isbn = this.get('value');
		if(!isbn) {
			return true;
		}

    isbn = isbn.replace(/[^0-9X]/gi, '');

    if (isbn.length !== 10 && isbn.length !== 13) {
      return false;
    }

    if (isbn.length === 13) {
      sum = 0;
      for (i = 0; i < 12; i++) {
        digit = parseInt(isbn[i]);
        if (i % 2 === 1) {
          sum += 3*digit;
        } else {
          sum += digit;
        }
      }
      check = (10 - (sum % 10)) % 10;
      return (check.toString() === isbn[isbn.length-1]);
    }

    if (isbn.length === 10) {
      weight = 10;
      sum = 0;
      for (i = 0; i < 9; i++) {
        digit = parseInt(isbn[i]);
        sum += weight*digit;
        weight--;
      }
      check = 11 - (sum % 11);
      if (check === 10) {
        check = 'X';
      }
      return (check.toString() === isbn[isbn.length-1].toUpperCase());
    }
	}),
    journalSelected:function(){
        if (!this.get('selectedJournal')){
          return;
        }
        var journal = this.get('selectedJournal') ;
        this.set('issn',journal.issn);
        this.set('eissn',journal.eissn);
        this.set('sourcetitle',journal.title);
        this.set('journal_id',journal.id);
    }.observes("selectedJournal"),
    actions: {
        queryJournals: function(query, deferred) {
            this.store.find('journal', { search_term: query.term })
                .then(deferred.resolve, deferred.reject);
            
        },
        sourceTitleTypeChanged: function(){
          if (this.get('sourceTitleType') === 'freetext'){
            this.set('journal_id', null);
            this.set('selectedJournal', null);
          }
        }
    }
});
