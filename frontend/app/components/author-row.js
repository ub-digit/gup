import Ember from "ember";
export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  errors: null,
  /*
  resetForm: function() {
    if (this.get("item.newAuthorForm")) {
      if(!this.get('item.importedAuthorName')) {
        this.set("item.newAuthorForm.firstName", '');
        this.set("item.newAuthorForm.lastName", '');
      }
      this.set("item.newAuthorForm.year_of_birth", '');
      this.set("item.newAuthorForm.xaccount", '');
      this.set("item.newAuthorForm.orcid", '');
    }
  },
  */

  isFirst: Ember.computed("index", function () {
    if (this.get("index") === 0) {
      return "is-first";
    }
    return;
  }),

  isLast: Ember.computed("index", "totalNumberOfItems", function () {
    if (this.get("index") + 1 === this.get("totalNumberOfItems")) {
      return "is-last";
    }
    return;
  }),

  init: function () {
    this._super(...arguments);
    // Helper function for persisting new author items, returns promise
    this.set("createAuthor", (item) => {
      return this.store
        .save("person", {
          first_name: item.newAuthorForm.get("firstName"),
          last_name: item.newAuthorForm.get("lastName"),
          year_of_birth: item.newAuthorForm.get("year_of_birth"),
          xaccount: item.newAuthorForm.get("xaccount"),
          orcid: item.newAuthorForm.get("orcid"),
          skip_update_search_engine: item.newAuthorForm.get(
            "skip_update_search_engine"
          ),
        })
        .then((model) => {
          item.set("selectedAuthor", model);
          item.set("transformedToNewAuthor", false);
        });
    });

    //TODO: Forgotten how to Ember, is this correct or should be property on object sent to extend??
    this.set("invalidSelectedDepartments", Ember.A([]));

    this.get("submitCallbacks").addObject(() => {
      if (this.get("isUnsaved") || this.get("isUnsavedImported")) {
        //TODO: promt user if isUnsaved? "Save", "Discard", "Cancel"?
        let item = this.get("item");
        if (this.get("isUnsavedImported")) {
          item.newAuthorForm.set(
            "firstName",
            item.get("importedAuthorFirstName")
          );
          item.newAuthorForm.set(
            "lastName",
            item.get("importedAuthorLastName")
          );
        }
        // TODO: Why do we do this?
        item.newAuthorForm.set("skip_update_search_engine", true);
        return this.get("createAuthor")(item);
      }
      return Ember.RSVP.Promise.resolve();
    });
  },
  // Helper
  // Could be generalized, with dynamic prop and made global helper
  getDepartmentIds: function (departments) {
    return departments.reduce(function (result, department) {
      result[department.id] = department.id; //TODO: or null?
      return result;
    }, []);
  },

  getCssId: Ember.computed("item", function () {
    return "_" + this.get("item.id");
  }),

  departmentIds: Ember.computed("institutions.[]", function () {
    //TODO: or this.get(?
    return this.getDepartmentIds(this.get("institutions"));
  }),

  departmentsChanged: Ember.observer("institutions.[]", function () {
    // Restore all departments no longer invalid
    let invalid_selected_departments_was_present = Ember.isPresent(
      this.get("invalidSelectedDepartments")
    );
    let restored_departments = [];
    let invalid_selected_departments = this.get(
      "invalidSelectedDepartments"
    ).filter((department) => {
      let restored_department = this.get("institutions").findBy(
        "id",
        department.id
      );
      if (restored_department) {
        restored_departments.push(restored_department);
        return false;
      }
      return true;
    });

    if (Ember.isPresent(restored_departments)) {
      this.get("item.selectedInstitution").pushObjects(restored_departments);
      this.set("invalidSelectedDepartments", invalid_selected_departments);
    }

    // Are any of the selected institutions no longer within the selectable institutions
    let department_ids = this.get("departmentIds");
    let removed_departments = [];
    let valid_selected_departments = this.get(
      "item.selectedInstitution"
    ).filter((department) => {
      if (department_ids[department.id] === undefined) {
        removed_departments.push(department);
        return false;
      }
      return true;
    });
    this.set("item.selectedInstitution", valid_selected_departments);

    removed_departments.forEach((department) => {
      let active_years = "";
      if (department.start_year || department.end_year) {
        active_years =
          " (" +
          (department.start_year || "?") +
          " - " +
          (department.end_year || "") +
          ")";
      }
      // Create peudo department objects since we loose reference to "real" department object
      // if removed for selectable department we can later retrieve the department by id if appears again
      this.get("invalidSelectedDepartments").pushObject({
        id: department.id,
        info: department.name + active_years,
      });
    });

    let invalid_selected_deparments_is_present = Ember.isPresent(
      this.get("invalidSelectedDepartments")
    );
    if (invalid_selected_departments_was_present) {
      if (!invalid_selected_deparments_is_present) {
        this.get("onInvalidSelectedDepartmentsEmpty")();
      }
    } else if (invalid_selected_deparments_is_present) {
      this.get("onInvalidSelectedDepartmentsPresent")();
    }
    /*
    if(Ember.isPresent(restored_departments) || Ember.isPresent(removed_departments)) {
      this.get('invalidSelectedDepartmentsChanged')(this.get('invalidSelectedDepartments'));
    }
    */
  }),

  validDepartmentSuggestions: Ember.computed(
    "item.selectedAuthor",
    "departmentIds",
    function () {
      let author_departments = this.get("item.selectedAuthor.departments");
      if (Ember.isArray(author_departments)) {
        // Create array keyed by institution id for faster lookup
        let department_ids = this.get("departmentIds");
        return author_departments
          .filter((department) => {
            // Filter out departments not present in selectable institutions
            return department_ids[department.id] !== undefined;
          })
          .map((department) => {
            return Ember.Object.create({
              name: department.name,
              department: department,
            });
          });
      }
      return Ember.A([]);
    }
  ),

  selectedDepartmentIds: Ember.computed(
    "item.selectedInstitution.[]",
    function () {
      return this.getDepartmentIds(this.get("item.selectedInstitution"));
    }
  ),

  nonSelectedValidDepartmentSuggestions: Ember.computed(
    "validDepartmentSuggestions",
    "selectedDepartmentIds",
    function () {
      let selected_department_ids = this.get("selectedDepartmentIds");
      if (Ember.isPresent(selected_department_ids)) {
        return this.get("validDepartmentSuggestions").filter((suggestion) => {
          return (
            selected_department_ids[suggestion.get("department").id] ===
            undefined
          );
        });
      }
      return this.get("validDepartmentSuggestions");
    }
  ),

  nonSelectedDepartmentSuggestions: Ember.computed(
    "departmentSuggestions.@each.selected",
    function () {
      return this.get("departmentSuggestions").filterBy("selected", false);
    }
  ),

  // Used to signal select2-adjusted component to set a default query string
  setDefaultQuery: Ember.computed(
    "item.importedAuthorName",
    "item.selectedInstitution",
    "item.selectedAuthor.last_name",
    "item.newAuthorForm.lastName",
    function () {
      return (
        Ember.isEmpty(this.get("item.newAuthorForm.lastName")) &&
        (Ember.isPresent(this.get("item.importedAuthorName")) ||
          (Ember.isEmpty(this.get("item.selectedInstitution")) &&
            Ember.isPresent(this.get("item.selectedAuthor.last_name"))))
      );
    }
  ),

  defaultQuery: Ember.computed(
    "item.importedAuthorLastName",
    "item.selectedInstitution",
    "item.selectedAuthor.last_name",
    "item.newAuthorForm.lastName",
    function () {
      if (Ember.isEmpty(this.get("item.newAuthorForm.lastName"))) {
        if (Ember.isPresent(this.get("item.importedAuthorName"))) {
          return this.get("item.importedAuthorName");
        } else if (
          Ember.isEmpty(this.get("item.selectedInstitution")) &&
          Ember.isPresent(this.get("item.selectedAuthor.last_name"))
        ) {
          return this.get("item.selectedAuthor.last_name");
        }
      }
    }
  ),

  importedAuthorName: Ember.computed(
    "item.importedAuthorName",
    "item.selectedInstitution",
    "item.selectedAuthor.presentation_string",
    function () {
      if (Ember.isPresent(this.get("item.importedAuthorName"))) {
        return this.get("item.importedAuthorName");
      } else if (Ember.isEmpty(this.get("item.selectedInstitution"))) {
        return this.get("item.selectedAuthor.presentation_string");
      }
    }
  ),

  isImportedExternal: Ember.computed(
    "importedAuthorName",
    "addAffiliation",
    function () {
      return this.get("importedAuthorName") && !this.get("addAffiliation");
    }
  ),

  isUnsaved: Ember.computed(
    "item.transformedToNewAuthor",
    "item.newAuthorForm.lastName",
    function () {
      return (
        this.get("item.transformedToNewAuthor") &&
        !Ember.isBlank(this.get("item.newAuthorForm.lastName"))
      );
    }
  ),

  isUnsavedImported: Ember.computed(
    "isUnsaved",
    "item.selectedAuthor",
    "item.importedAuthorName",
    function () {
      //TODO check for lastname or see where is set
      return (
        !this.get("isUnsaved") &&
        !Ember.isPresent(this.get("item.selectedAuthor")) &&
        this.get("item.importedAuthorName")
      );
    }
  ),

  //isEmpty: Ember.computed('item.
  /*
  newAuthorFormVisible: function() {
    var self = this;
    if (this.get('item.transformedToNewAuthor')) {
      this.resetForm();
      Ember.run.later(function() {
        self.$().find('#first-name').focus();
      });
    }
  }.observes('item.transformedToNewAuthor'),
  */

  transformedNewAuthorTriggered: function () {
    if (this.get("item.transformedToNewAuthor")) {
      this.send("showAddNewAuthorForm");
    }
  }.observes("item.transformedToNewAuthor"),

  actions: {
    authorInstitutionsChanged: function (institutions) {
      this.set("item.selectedInstitution", institutions);
    },
    queryAuthors: function (query, deferred) {
      //TODO: This utility function should be accessible to other classes
      // put it somewhere else, in service?
      function zipDepartments(doc, locale) {
        var departments = [];
        if (Ember.isArray(doc.departments_id)) {
          departments = doc.departments_id.map((department_id, index) => {
            let start_year = doc["departments_start_year"][index];
            let end_year = doc["departments_end_year"][index];
            return {
              id: department_id,
              name: doc["departments_name_" + locale][index],
              start_year: start_year !== -1 ? start_year : null,
              end_year: end_year !== -1 ? end_year : null,
            };
          });
        }
        return departments;
      }
      var result = this.store.find("person_gup_admin_record", {
        search_term: query.term,
      });
      result.then(
        (data) => {
          data = data.map((item) => {
            // Create presentation string
            let name = item.first_name + " " + item.last_name;
            let year = item.year_of_birth;
            let id = [item.xaccount, item.orcid].compact().join(", ");

            let departments = [];
            if (item.has_affiliations) {
              item.departments_id.forEach((department_id, index) => {
                departments.push({
                  id: department_id,
                  name_sv: item.departments_name_sv[index],
                  name_en: item.departments_name_en[index],
                  start_year: item.departments_start_year[index],
                  end_year: item.departments_end_year[index],
                });
              });
            }
            let departments_str = "";
            departments.forEach((department, index) => {
              if (index > 2) {
                return;
              }
              let year_str = "";
              if (department.start_year !== null) {
                year_str += department.start_year;
                if (
                  department.end_year !== null &&
                  department.end_year !== -1
                ) {
                  year_str += " - " + department.end_year;
                }
              }
              departments_str +=
                "<span class='department_name'>" +
                department.name_sv +
                "</span>" +
                "<span> (" +
                "<span class='department_year'>" +
                year_str +
                "</span>" +
                "<span>)</span>" +
                "<br/>";
            });
            item.presentation_string = Ember.String.htmlSafe(
              [name, year].compact().join(", ") +
                (id ? " " + ["(", id, ")"].join("") : "") +
                " " +
                "<br/><span class='departments small'>" +
                departments_str +
                "</span><br/>"
            );
            //TODO: This is perhaps a little bit of a micro-opmtimization overkill
            // but instead of extracting departments greedily here
            // (there can be quite a lot of authors)
            // get departments lazily through getter function
            Object.defineProperty(item, "departments", {
              get: () => {
                return zipDepartments(item, this.get("i18n.locale"));
              },
            });
            return item;
          });
          if (this.get("queryAuthorsResult")) {
            data = this.get("queryAuthorsResult")(data);
          }
          deferred.resolve(data);
        },
        function (reason) {
          //warning?
          console.error(reason);
          deferred.reject(reason);
        }
      );
    },
    moveUpOne: function (id) {
      this.sendAction("moveUp", id);
    },

    moveDownOne: function (id) {
      this.sendAction("moveDown", id);
    },

    remove: function (id) {
      this.sendAction("removeAuthor", id);
    },

    showAddAffiliation: function () {
      this.set("addAffiliation", true);
    },

    showAddNewAuthorForm: function () {
      // TODO: item not used here
      // create new author
      this.set(
        "item.newAuthorForm",
        Ember.Object.create({
          // set imported author first and last name to imported author if any
          firstName: this.get("item.importedAuthorFirstName"),
          lastName: this.get("item.importedAuthorLastName"),
          year_of_birth: "",
          xaccount: "",
          orcid: "",
        })
      );
      this.get("item").set("transformedToNewAuthor", true);
    },

    cancelAddNewAuthorForm: function (item) {
      // TODO: item not used here
      this.get("item").set("transformedToNewAuthor", false);
      // Reset form
      this.set(
        "item.newAuthorForm",
        Ember.Object.create({
          firstName: "",
          lastName: "",
          year_of_birth: "",
          xaccount: "",
          orcid: "",
        })
      );
    },

    createAuthor: function (item) {
      // TODO: Should validate required properties (lastName)!?
      this.get("createAuthor")(item).catch((reason) => {
        this.sendAction("setMsgHeader", "error", reason.error.msg);
        this.set("errors", reason.error.errors);
        //TODO: fix, schedule after render instead?
        Ember.run.later(function () {
          Ember.$('[data-toggle="popover"]').popover({
            placement: "top",
            html: true,
          });
        });
      });
    },
    addInstitution: function (institution) {
      // Add institution to selected array
      let selectedInstitutionCopy = Ember.copy(
        this.get("item.selectedInstitution")
      );
      // Have to overwrite value, since select2 observes "value"
      // (in this case bound to selectedInstitutions)
      // but is not smart enough to detect changes within "value" (selectedInstitutions.[])
      //TODO: This is fubar
      let institutionObject =
        institution instanceof Ember.Object
          ? institution
          : Ember.Object.create(institution);
      selectedInstitutionCopy.addObject(institutionObject);
      this.set("item.selectedInstitution", selectedInstitutionCopy);
      // Add institution to select2 component
      /*
      var id = '#s2id_' + this.get('item.id');
      var institutionsElement = Ember.$(id).select2('data');
      institutionsElement.addObject(institutionObject);
      Ember.$(id).select2('data', institutionsElement);
      */
    },
  },
});
