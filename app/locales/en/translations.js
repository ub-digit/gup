export default {
  components: {
    publicationIdentifierBlock: {
      label: 'Identifier',
      code: 'Type',
      value: 'Value',
      delete: 'Delete',
      create: 'Add',
    },
    authorBlock: {
      btnAddNewAuthor: 'Add new author',
      mandatory: '(mandatory)',
      authorHeaderTextStrong: {
        'default': 'Author',
        'publication_edited-book': 'Editor',
        'publication_journal-issue': 'Editor',
        'conference_proceeding': 'Editor',
        'publication_textcritical-edition': 'Editor'
      },
    },
    publicationFieldFiles: {
    },
    publicationFieldPreview: {
    },
    paginationPager: {
      previous: 'Previous',
      next: 'Next',
    },
    categorySelector: {
      addCategory: 'Add subject categories',
      modalHeader: 'Add subject categories',
      selectedCategories: 'Selected subject categories:',
      noCategoriesSelected: 'No selected categories',
      subjectTerms: 'Subject categories',
      clear: 'Clear',
      noFilteredSubjectTerms: 'No subject categories found',
      close: 'Close',
    },
    publicationFieldCompare: {
    },
    publicationDisplay: {
      version: 'Version',
      versionBy: 'updated by',
      currentVersion: 'Current version',
      selectVersion: '- Select version -',
      selectContentTypeLabel: 'Content type',
      publicationType: 'publication type',
      publicationIdentifier: {
        label: 'Identifiers',
      },
    },      
    mailerModal: {
      report: 'GUP support',
      description: 'You can contact GUP support. Please add your e-mail for feedback.',
      send: 'Send',
      dismiss: 'Dismiss',
      message: 'Message',
      successMessage: 'Message sent.',
    },
    reviewItem: {
      reviewDetailsHeader: 'Review and appprove your publication:',
      lastReview: 'Approved:',
      publicationType: 'Publication type:',
      contentType: 'Content type:',
      affiliation: 'Your affiliation:',
      categories: 'Subject categories:',
      approve: 'Approve',
      approved: 'Approved',
      edit: 'Edit',
      addedObject: 'New!',
      approveSuccess: 'Publication approved.',
      approveError: 'Publication could not be approved.',
    },
    publicationtypeItem: {
    },
    fieldComponent: {
      radioLabel1: 'Select a journal',
      radioLabel2: 'Enter as free text',
    },
    publicationListRow: {
      noTitle: '-- Missing title --',
      publicationID: "Publication ID",
      publicationType: "Publication type",
      contentMarker: "Content type",
      createdAt: "Created",
      published: "Published",
    },
    fileUpload: {
    },
    publicationFieldBiblReview: {
    },
    authorsString: {
    },
    authorRow: {
      addAffiliation: "Add affiliation",
      firstname: 'First name:',
      lastname: 'Family name:',
      birthyear: 'Year of birth:',
      xaccount: 'x-account',
      orcid: 'Orcid',
      btnSave: 'Save',
      btnCancel: 'Cancel',
      selectAuthor: {
        label: 'Select author name',
        placeholder: 'Select author name',
        typeaheadSearchingText: 'Searching',
        typeaheadNoMatchesText: 'No matching names found',
        didNotFindPersonText: 'If you did not find the correct name, please create a new one.',
        formatInputTooShortText: 'Enter at least 3 characters',
        btnCreateNew: 'Create new',
      },
      suggestedDepartments: {
        label: 'Suggested departments'
      },
      selectInstitutions: {
        label: 'Select departments',
        placeholder: 'Select departments',
        sortingLink: 'Sort?'
      },
    },
    delayReviewModal: {
      delay: 'Delay',
      delayHeader: 'Delay review of publication',
      date: 'Date',
      comment: 'Comment',
      btnDelay: 'Delay',
      reviewPostponedUntil: 'Postponed until',
      delaySuccess: "Review postponed.",
      delayError: "Publication could not be postponed."
    },
    debouncedInput: {
    },
    fileUploadWidget: {
      checkFile: 'Check your uploaded file',
      enterEmbargoDate: 'Enter an embargo date',
      showAfter: 'Display file only after',
      readAgreement: 'Read agreement (new window)',
      modalDismiss: 'Dismiss',
      modalSave: 'Save',
    },
    categoryItem: {
    },
  },
  header: {
  },
  login: {
    header: 'Sign in',
    button: 'Sign in',
    username: 'x-account',
    usernamePlaceholder: 'x-account',
    password: 'Password',
    passwordPlaceholder: 'Password',
    loginError: "Wrong x-account or password. Please try again.",
  },
  mainMenu: {
    applicationName: 'GUP',
    publications: 'Publications',
    forReview: 'Review',
    forBReview: 'Bibliographic review',
    registeredOrEditedByMe: 'My entries',
    dropdownOther: "Other",
    admin: 'Admin',
    reports: 'Stats and reports',
    lang: 'Svenska',
    logOut: 'Logout',
    idMissing: 'Missing ID'
  },
  application: {
    title: "GUP",
  },
  msgheader: {
  },
  publications: {
    dashboard: {
      reports: {
        title: "Stats and reports",
        select_criteria: "Select criteria",
        export_csv: "Export to Excel",
        year: "Year",
        start_year: "Start",
        end_year: "End",
        include_as_column: "Column",
        faculty: "Faculty",
        select_faculty: "Select faculty",
        create: "Create",
        department: "Department",
        publication_type: "Publication type",
        content_type: "Content type",
        select_department: "Select department",
        person: "Person",
        select_person: "Select person",
        ref_value: "Peer reviewed",
        groupingHeader: 'Sort by',
        clearBtn: 'Clear',
      },
      manage: {
        _subnav: {
          published: 'My publications',
          drafts: 'My drafts',
          search: 'Search',
          file_imports: 'Uploaded lists',
        },
        _actions: {
          registerNew: 'New entry',
        },
        drafts: {
          title: "My drafts",
          numberOfHits: 'Number of hits',
          youHaveNoDrafts: 'You don\'t have any drafts.',
          saveDraftSuccess: 'Record saved as draft.',
          saveDraftError: 'The record could not be saved as draft.',
          deleteDraftSuccess: 'Draft deleted.',
          deleteDraftError: 'Draft could not be deleted.',
          confirmDeleteDraft: 'Are you sure you want to delete the draft?'
        },
        show: {
          title: "Show publication",
          publicationNotFound: 'Publication not found.',
          edit: {
            title: "Edit publication",
            btnCancel: 'Cancel',
            btnSaveDraft: 'Save draft',
            btnSaveAndPublish: 'Save and publish',
            saveDraftSuccess: 'Record saved as draft.',
            saveDraftError: 'The record could not be saved as a draft.',
            deleteDraftSuccess: 'Draft deleted.',
            deleteDraftError: 'Draft could not be deleted.',
            publishSuccess: 'Record published.',
            publishError: 'The record could not be published.',
            approveSuccess: 'Record approved.',
          },
          index: {
            errorMissingPublication: 'Missing publication',
            btnBack: 'Back',
            reviewModeInfo: 'Review mode.',
            reviewModeCancel: 'Tillbaka till visningsläge. ',
            deletePublicationSuccess: 'Publication deleted.',
            deletePublicationError: 'Publication could not be deleted.',
            approvePublicationSuccess: 'Publication approved.',
            approvePublicationError: 'Publication could not be apprved.',
            confirmDeletePublication: 'Are your sure you want to delete the publication?',
            epubAheadOfPrintSince: 'E-pub ahead of print since: ',
            _subnav: {
              attachFile: 'Attach file',
              edit: 'Edit',
              delete: 'Delete',
              reviewMode: 'Review mode',
              viewMode: 'View mode',
              delay: 'Delay',
              biblreview: 'Reviewed',
              compare: 'Compare versions'
            },
            meta: {
              publicationType: 'publication type',
              createdAt: 'Created',
              createdBy: 'Created by',
              updatedAt: 'Updated',
              updatedBy: 'Updated by',
              publishedAt: 'Published',
              reviewedAt: 'Reviewed',
              reviewedBy: 'Reviewed by',
              reviewStart: 'Can be reviewed at',
              reviewPostponedUntil: 'Postponed until',
              delayComment: 'Comment',
              by: 'by',
            },
          },
        },
        published: {
          title: "My publications",
          numberOfHits: 'Number of hits',
          youHaveNoPublications: 'You don\'t have any publications',
        },
        start: {
        },
        search: {
          title: "Search",
          searchForPublicationWithPubid: 'Search for a publication with GUP-ID:',
          searchById: 'Search for GUP-ID',
        },
        new: {
          title: "New publication",
          btnBack: "Back to list",
          header: 'New publication',
          importPub: {
            header: 'Import from source',
            ingress: 'Use an ID for importing records from other sources, e.g. PubMed, Scopus or Libris.',
            form: {
              selectImportSourcePrompt: 'Select source',
              inputId: {
                placeholder: 'e.g.',
              },
              fetchButton: 'Get record'
            },
            importConfirmation: {
              header: 'Do you want to import this publication:',
              title: 'Title:',
              author: 'Authors:',
              btnImport: 'Import',
              duplicateMessage: 'This record may already be registered!'
            },
          },
          manualPub: {
            header: 'Do you want to create an entry manually?',
            ingress: 'Create a new entry and type in information about the publication.',
            btnNew: 'New entry',
            linkNew: 'Add new author',
            addAffiliation: "Add affiliation"
          },
        },
      },
      review: {
        title: "Review",
        youHaveNoPublicationsForReview: 'You don\'t have any publications for review',
      },
      biblreview: {
        title_page: "Bibliographic review",
        numberOfHits: 'Number of hits',
        selectPublicationTypePrompt: 'All publication types',
        selectPublicationYearPrompt: 'All years',
        selectFacultyPrompt: 'All faculties',
        orLater: 'and later',
        orEarlier: 'and earlier',
        pubid: 'Publication ID',
        title: 'Title',
        year: 'Year',
        pubtype: 'publication type',
        delay: 'Delay',
        delayHeader: 'Delay review of publication',
        date: 'Date',
        comment: 'Comment',
        btnDelay: 'Delay',
        showDelayedOnly: 'Just show delayed records',
        noPublicationsForReview: 'No publications found for review',
      },
      touched: {
        title: "My edited publications",
        numberOfHits: 'Number of hits',
        youHaveNoRegisteredOrEditedPublications: 'You haven\'t entered or edited publications.',
      },
      loading: {
      },
    },
    publicationtypes: {
      selector: {
        selectorHeading: "Select publication type",
        btnCancel: 'Cancle',
        publicationtype: {
          all: 'All',
          articles: 'Articles',
          books: 'Books, chapters and reports',
          conference: 'Conference contributions',
          artworks: 'Artistic works',
          other: 'Other',
        },
      },
      form: {
        publicationType: 'Publication type',
        changePublicationTypeLink: 'Change',
        help: {
          authors: {
            helptext: 'Please register all authors in the same order as mentioned in the original publication. If the author is affiliated to GU, register family name and first name and if the author is not affiliated to GU, register family name and first name’s initial. Please search for already registered authors before creating a new one.',
          },
          category_hsv_local: {
            helptext: 'Please add at least one subject category. For more information please see:  http://www.ub.gu.se/publicera/',
          },
          pub_notes: {
            helptext: 'Here you can add information that does not fit into one of the other fields. Please notice that this information will be publicly displayed.',
          },
          publicationIdentifiers: {
            helptext: 'If you add an identifier it will be easier for others to find your publication and to confirm that this record is the right one. This may be helpful for disseminating your publication.',
          },
          publisher: {
            placeholder: 'E.g. "Journal of testing" or ISSN 1234-5678',
          },
        },
      },
    },
    index: {
    },
  },
  footer: {
  },
  admin: {
    admin_departments: 'Manage department records',
    admin_people: 'Manage name records',
    admin_messages: 'Manage messages',
    departments: {
      title: "Manage department records",
      query_department: 'Search for department',
      query_department_none: 'No departments found',
      btnNew: 'New record',
      btnSave: 'Save',
      btnCancel: 'Cancel',
      btnRemoveEndYear: 'Remove end year',
      btnEditEndYear: 'Edit end year ',
      modalHeader: 'Edit end year',
      id: 'ID',
      name_sv: 'Swedish name',
      name_en: 'English name',
      start_year: 'Start year',
      end_year: 'End year',
      new: {
        title: "Create new department",
        btnBack: 'Back',
        header: 'Create new department',
        save: 'Create new department',
        noFaculty: 'No faculty',
        labels: {
          nameSv: 'Name (Swedish)',
          nameEn: 'Name (English)',
          startYear: 'Start year',
          endYear: 'End year',
          faculty: 'Faculty',
        },
      },
      index: {
        invalidYear: "Invalid year",
        saveError: "Could not be saved"
      },
    },
    people: {
      title: "Manage author records",
      id: 'ID',
      first_name: 'First name',
      last_name: 'Family name',
      xaccount: 'X-account',
      orcid: 'ORCID',
      birthyear: 'Year of birth',
      btnEdit: 'Edit',
      btnSave: 'Save',
      btnDelete: 'Radera',
      query_person: 'Search for author',
      query_person_none: 'No records found',
      index: {
        confirmDeletePerson: 'Are you sure you want to delete the record?'
      },
      person: {
        personChangeWarningAfterEdit: 'Innehållet i sökresultatet kan ha förändrats p g a redigeringen.',
        edit: {
          form: {
            labels: {
              id: 'Id:',          
              firstname: 'Förnamn:',
              lastname: 'Efternamn:',
              birthyear: 'Födelseår:',
              xaccount: 'x-konto',
              orcid: 'Orcid'
            },
            placeholders: {
              id: 'Id:',          
              firstname: 'Förnamn:',
              lastname: 'Efternamn:',
              birthyear: 'Födelseår:',
              xaccount: 'x-konto',
              orcid: 'Orcid'
            },
            actions: {
              btnSave: 'Spara',
              btnCancel: 'Avbryt'
            },
          },
        },
      },
    },
    messages: {
      title: "Manage messages",
      newsMessageHeader: 'News message',
      alertMessageHeader: 'Driftmeddelande',
      message: 'Message',
      start_date: 'Start date',
      end_date: 'End date',
      save: 'Save',
      delete: 'Delete',
      saved: 'Message saved',
      deleted: 'Message deleted',
      saveError: 'Could not save message',
      deleteError: 'Could not delete message'
    },
  },
};