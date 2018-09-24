import Ember from 'ember';
import Select2 from 'ember-select-2/components/select-2';

var get = Ember.get;
var run = Ember.run;
export default Select2.extend({
  didInsertElement: function() {
    var that = this,
        options = {},
        optionIdPath = this.get('optionIdPath'),
        optionLabelPath = this.get('optionLabelPath'),
        optionHeadlinePath = this.get('optionHeadlinePath'),
        optionDescriptionPath = this.get('optionDescriptionPath'),
        content = this.get('content');


    // ensure select2 is loaded
    Ember.assert("select2 has to exist on Ember.$.fn.select2", typeof Ember.$.fn.select2 === "function");

    // setup
    options.placeholder = this.get('placeholder');
    options.multiple = this.get('multiple');
    options.allowClear = this.get('allowClear');
    options.minimumResultsForSearch = this.get('searchEnabled') ? 0 : -1 ;

    options.minimumInputLength = this.get('minimumInputLength');
    options.maximumInputLength = this.get('maximumInputLength');

    // override select2's default id fetching behavior
    options.id = (function(e) {
      return (e === undefined) ? null : get(e, optionIdPath);
    });

    // allowClear is only allowed with placeholder
    Ember.assert("To use allowClear, you have to specify a placeholder", !options.allowClear || options.placeholder);

    // search can't be disabled for multiple selection mode
    var illegalSearchInMultipleMode = options.multiple && !this.get('searchEnabled');
    Ember.assert("Search field can't be disabled for multiple selection mode", !illegalSearchInMultipleMode);

    /*
      Formatting functions that ensure that the passed content is escaped in
      order to prevent XSS vulnerabilities. Escaping can be avoided by passing
      Handlebars.SafeString as "text", "headline" or "description" values.

      Generates the html used in the dropdown list (and is implemented to
      include the description html if available).
     */
    options.formatResult = function(item) {
      if (!item) {
        return;
      }

      var output,
          id = get(item, optionIdPath),
          text = get(item, optionLabelPath),
          headline = get(item, optionHeadlinePath),
          description = get(item, optionDescriptionPath);

      if (item.children) {
        output = Ember.Handlebars.Utils.escapeExpression(headline);
      } else {
        output = Ember.Handlebars.Utils.escapeExpression(text);
      }

      // only for "real items" (no group headers) that have a description
      if (id && description) {
        output += " <span class=\"text-muted\">" +
          Ember.Handlebars.Utils.escapeExpression(description) + "</span>";
      }

      return output;
    };

    /*
      Generates the html used in the closed select input, displaying the
      currently selected element(s). Works like "formatResult" but
      produces shorter output by leaving out the description.
     */
    options.formatSelection = function(item) {
      if (!item) {
        return;
      }

      var text = get(item, optionLabelPath);

      // escape text unless it's passed as a Handlebars.SafeString
      return Ember.Handlebars.Utils.escapeExpression(text);
    };

    /*
      Provides a list of items that should be displayed for the current query
      term. Uses the default select2 matcher (which handles diacritics) with the
      Ember compatible getter method for optionLabelPath.
     */
    options.query = function(query) {
      var select2 = this;

      if (that.get('_typeaheadMode')) {
        var deferred = Ember.RSVP.defer('select2#query: ' + query.term);

        that.sendAction('query', query, deferred);

        deferred.promise.then(function(data) {
          if (data instanceof Ember.ArrayProxy) {
            data = data.toArray();
          }
          query.callback({
            results: data
          });
        }, function(reason) {
          query.callback({
            hasError: true,
            errorThrown: reason
          });
        });
      } else {
        Ember.assert("select2 has no content!", that.get('content'));

        var filteredContent = that.get("content").reduce(function(results, item) {
          // items may contain children, so filter them, too
          var filteredChildren = [];

          if (item.children) {
            filteredChildren = item.children.reduce(function(children, child) {
              if (select2.matcher(query.term, get(child, optionLabelPath)) || select2.matcher(query.term, get(child, optionHeadlinePath))) {
                children.push(child);
              }
              return children;
            }, []);
          }

          // apply the regular matcher
          if (select2.matcher(query.term, get(item, optionLabelPath)) || select2.matcher(query.term, get(item, optionHeadlinePath))) {
            // keep this item either if itthat matches
            results.push(item);
          } else if (filteredChildren.length) {
            // or it has children that matched the term
            var result = Ember.$.extend({}, item, { children: filteredChildren });
            results.push(result);
          }
          return results;
        }, []);

        query.callback({
          results: filteredContent
        });
      }
    };

    /*
      Supplies the string used when searching for options, can be set via
      `typeaheadSearchingText`
     */
    options.formatSearching = function() {
      var text = that.get('typeaheadSearchingText');

      return Ember.String.htmlSafe(text);
    };

    /*
      Format the no matches message, substituting the %@ placeholder with the
      html-escaped user input
     */
    options.formatNoMatches = function(term) {
      var text = that.get('typeaheadNoMatchesText');

      if (text instanceof Ember.Handlebars.SafeString) {
        text = text.string;
      }
      term = Ember.Handlebars.Utils.escapeExpression(term);

      return text;
      //return (Ember.String.fmt(text, term));

    };

    /*
      Format the error message, substituting the %@ placeholder with the promise
      rejection reason
     */
    options.formatAjaxError = function(jqXHR, textStatus, errorThrown) {
      var text = that.get('typeaheadErrorText');

      return Ember.String.htmlSafe(Ember.String.fmt(text, errorThrown));
    };

    /*
      Maps "value" -> "object" when using select2 with "optionValuePath" set,
      and one time directly when setting up the select2 plugin even without "oVP".
      (but with empty value, which will just skip the method)

      Provides an object or an array of objects (depending on "multiple") that
      are referenced by the current select2 "val".

      When there are keys that can not be matched to objects, the select2 input
      will be disabled and a warning will be printed on the console.
      This is important in case the "content" has yet to be loaded but the
      "value" is already set and must not be accidentally changed because the
      inout cannot yet display all the options that are required.

      To disable this behaviour, remove those keys from "value" that can't be
      matched by objects from "content".
     */
    options.initSelection = function(element, callback) {
      var value = element.val(),
          content = that.get("content"),
          contentIsArrayProxy = Ember.ArrayProxy.detectInstance(content),
          multiple = that.get("multiple"),
          optionValuePath = that.get("optionValuePath");

      if (!value || !value.length) {
        return callback([]);
      }

      // this method should not be needed without the optionValuePath option
      // but make sure there is an appropriate error just in case.
      Ember.assert("select2#initSelection has been called without an \"" +
        "optionValuePath\" set.", optionValuePath);

      Ember.assert("select2#initSelection can not map string values to full objects " +
        "in typeahead mode. Please open a github issue if you have questions to this.",
        !that.get('_typeaheadMode'));


      var values = value.split(","),
          filteredContent = [];

      // for every object, check if its optionValuePath is in the selected
      // values array and save it to the right position in filteredContent
      var contentLength = get(content, 'length'),
          unmatchedValues = values.length,
          matchIndex;

      // START loop over content
      for (var i = 0; i < contentLength; i++) {
        var item = contentIsArrayProxy ? content.objectAt(i) : content[i];
        matchIndex = -1;

        if (item.children && item.children.length) {
          // take care of either nested data...
          for (var c = 0; c < item.children.length; c++) {
            var child = item.children[c];
            matchIndex = values.indexOf("" + get(child, optionValuePath));
            if (matchIndex !== -1) {
              filteredContent[matchIndex] = child;
              unmatchedValues--;
            }
            // break loop if all values are found
            if (unmatchedValues === 0) {
              break;
            }
          }
        } else {
          // ...or flat data structure: try to match simple item
          matchIndex = values.indexOf("" + get(item, optionValuePath));
          if (matchIndex !== -1) {
            filteredContent[matchIndex] = item;
            unmatchedValues--;
          }
          // break loop if all values are found
          if (unmatchedValues === 0) {
            break;
          }
        }
      }
      // END loop over content

      if (unmatchedValues === 0) {
        that.set('_hasSelectedMissingItems', false);
      } else {
        // disable the select2 element if there are keys left in the values
        // array that were not matched to an object
        that.set('_hasSelectedMissingItems', true);

        Ember.warn("select2#initSelection was not able to map each \"" +
          optionValuePath +"\" to an object from \"content\". The remaining " +
          "keys are: " + values + ". The input will be disabled until a) the " +
          "desired objects is added to the \"content\" array or b) the " +
          "\"value\" is changed.", !values.length);
      }

      if (multiple) {
        // return all matched objects
        return callback(filteredContent);
      } else {
        // only care about the first match in single selection mode
        return callback(filteredContent.get('firstObject'));
      }
    };

    /*
      Forward a custom css class to the components container and dropdown.
      The value will be read from the `cssClass` binding
     */
    options.containerCssClass = options.dropdownCssClass = function() {
      return that.get('cssClass') || '';
    };

    this._select = this.$().select2(options);

    this._select.on("change", run.bind(this, function() {
      // grab currently selected data from select plugin
      var data = this._select.select2("data");

      // call our callback for further processing
      this.selectionChanged(data);
      var that = this;
      Ember.run.later(function() {
        Ember.$('ul.select2-choices').sortable({
          containment: 'parent',
          cursor: "move",
          update: function() {
            that.selectionChanged(that._select.select2("data"));
            //console.log("DEBUG data: ", that._select.select2("data"));
          }
        });
      });

    }));

    this.addObserver('content.[]', this.valueChanged);
    this.addObserver('content.[].' + optionLabelPath, this.valueChanged);
    this.addObserver('content.[].' + optionHeadlinePath, this.valueChanged);
    this.addObserver('content.[].' + optionDescriptionPath, this.valueChanged);
    this.addObserver('value', this.valueChanged);

    // trigger initial data sync to set select2 to the external "value"
    this.valueChanged();

    // eventually disable input when content is PromiseProxy
    if (Ember.PromiseProxyMixin.detect(content)) {
      // enabling/siabling is done via binding to _hasPendingContentPromise
      // provide error for rejected promise, though.
      content.then(null, function (reason) {
        Ember.warn("select2: content promise was reject with reason " + reason +
          ". Recovering from this is not (yet) implemented.");
      });
    }

    Ember.run.later(function() {
      Ember.$('ul.select2-choices').sortable({
        containment: 'parent',
        cursor: "move",
        update: function() {
          that.selectionChanged(that._select.select2("data"));
          //console.log("DEBUG data: ", that._select.select2("data"));
        }
      });
    });
    this.watchDisabled();

  },

});
