export default {
  components: {
    publicationIdentifierBlock: {
      label: 'Identifikatorer',
      code: 'Typ',
      value: 'Värde',
      delete: 'Ta bort',
      create: 'Lägg till',
    },
    authorBlock: {
      btnAddNewAuthor: 'Lägg till författare',
    },
    publicationFieldFiles: {
    },
    publicationFieldPreview: {
    },
    paginationPager: {
      previous: 'Föreg.',
      next: 'Nästa',
    },
    categorySelector: {
      addCategory: 'Lägg till ämnesord',
      modalHeader: 'Välj ämnesord',
      selectedCategories: 'Valda ämnesord:',
      noCategoriesSelected: 'Inga ämnesord valda',
      subjectTerms: 'Ämnesord',
      clear: 'Rensa',
      noFilteredSubjectTerms: 'Inga ämnesord matcher filtret',
      close: 'Stäng',
    },
    publicationFieldCompare: {
    },
    publicationDisplay: {
      version: 'Version',
      versionBy: 'uppdaterad av',
      currentVersion: 'Aktuell version',
      selectVersion: '- Välj äldre version -',
      selectContentTypeLabel: 'Innehållmärkning',
      publicationType: 'Publikationstyp',
      publicationIdentifier: {
        label: 'Identifikatorer',
      }
    },
    mailerModal: {
      report: 'Rapportera',
      send: 'Skicka rapport',
      dismiss: 'Avbryt',
      message: 'Meddelande',
      successMessage: 'Meddelandet skickades.',
    },
    reviewItem: {
      reviewDetailsHeader: 'Granska och godkänn följande:',
      lastReview: 'Senast granskad av dig:',
      publicationType: 'Publikationstyp:',
      contentType: 'Innehållsmärkning:',
      affiliation: 'Din affiliering:',
      categories: 'Ämnesord:',
      approve: 'Godkänn',
      approved: 'Godkänd',
      edit: 'Redigera',
      addedObject: 'Ny!',
    },
    publicationtypeItem: {
    },
    fieldComponent: {
      radioLabel1: 'Välj från lista',
      radioLabel2: 'Ange som fritext',
    },
    publicationListRow: {
    },
    fileUpload: {
    },
    publicationFieldBiblReview: {
    },
    authorsString: {
    },
    authorRow: {
      addAffiliation: "Ändra affiliering",
      firstname: 'Förnamn:',
      lastname: 'Efternamn:',
      birthyear: 'Födelseår:',
      xaccount: 'x-konto',
      orcid: 'Orcid',
      btnSave: 'Spara',
      btnCancel: 'Avbryt',
      selectAuthor: {
        label: 'Välj författare',
        placeholder: 'Välj författare',
        typeaheadSearchingText: 'Söker författare',
        typeaheadNoMatchesText: 'Hittade inga författare',
        didNotFindPersonText: 'Hittar du inte den du söker?',
        formatInputTooShortText: 'Ange minst 3 tecken',
        btnCreateNew: 'Skapa ny',
      },
      selectInstitutions: {
        label: 'Välj institutioner',
        placeholder: 'Välj institutioner',
        sortingLink: 'Sortera?'
      },
    },
    delayReviewModal: {
        delay: 'Fördröj',
        delayHeader: 'Fördröj granskning av publikation',
        date: 'Datum',
        comment: 'Kommentar',
        btnDelay: 'Fördröj',
        reviewPostponedUntil: 'Fördröjd till',
    },
    debouncedInput: {
    },
    fileUploadWidget: {
      checkFile: 'Kontrollera fil',
      enterEmbargoDate: 'Ange embargö',
      showAfter: 'Visa offentligt först efter',
      readAgreement: 'läs avtalet (nytt fönster)',
      modalDismiss: 'Avbryt',
      modalSave: 'Spara',
    },
    categoryItem: {
    }
  },
  header: {
  },
  login: {
    header: 'Logga in',
    button: 'Logga in',
    username: 'x-konto',
    usernamePlaceholder: 'x-konto',
    password: 'Lösenord',
    passwordPlaceholder: 'Lösenord',
  },
  mainMenu: {
    applicationName: 'GUP',
    publications: 'Publikationer',
    forReview: 'Att granska',
    forBReview: 'Bibl. granskn.',
    registeredOrEditedByMe: 'Mina registreringar',
    admin: 'Admin',
    reports: 'Statistik',
    lang: 'English',
    logOut: 'Logga ut',
    
    idMissing: 'Ogiltigt ID'

  },
  application: {
  },
  msgheader: {
  },
  publications: {
    dashboard: {
      reports: {
        select_criteria: "Välj kriterier",
        export_csv: "Exportera till Excel",
        year: "År",
        start_year: "Start",
        end_year: "Slut",
        include_as_column: "Kolumn",
        faculty: "Fakultet",
        select_faculty: "Välj fakultet",
        create: "Skapa rapport",
        department: "Institution",
        publication_type: "Publikationstyp",
        content_type: "Innehållsmärkning",
        select_department: "Välj institution",
        person: "Person",
        select_person: "Välj person",
        ref_value: "Refereegranskad",
        groupingHeader: 'Gruppera',
        clearBtn: 'Rensa',
      },
      manage: {
        _subnav: {
          published: 'Mina publikationer',
          drafts: 'Mina utkast',
          search: 'Sök',
        },
        _actions: {
          registerNew: 'Registrera ny',
        },


        drafts: {
          numberOfHits: 'Antal träffar',
          youHaveNoDrafts: 'Du har inga utkast.',
        },
        show: {
          edit: {
            btnCancel: 'Avbryt',
            btnSaveDraft: 'Spara utkast',
            btnSaveAndPublish: 'Spara och publicera',
          },
          index: {
            btnBack: 'Tillbaka',
            reviewModeInfo: 'Du tittar på posten i granskningsläge.',
            reviewModeCancel: 'Tillbaka till visningsläge. ',


            epubAheadOfPrintSince: 'E-pub ahead of print sedan: ',
            _subnav: {
              attachFile: 'Bifoga fil',
              edit: 'Redigera',
              delete: 'Radera',
              reviewMode: 'Granskningsläge',
              viewMode: 'Visningsläge',
              delay: 'Fördröj',
              biblreview: 'Markera som granskad',
              delay: 'Fördröj',
              compare: 'Jämför versioner'

            },
            meta: {
              publicationType: 'Publikationstyp',
              createdAt: 'Skapad',
              createdBy: 'Skapad av',
              updatedAt: 'Uppdaterad',
              updatedBy: 'Uppdaterad av',
              publishedAt: 'Publicerad',
              reviewedAt: 'Granskad',
              reviewedBy: 'Granskad av',
              reviewStart: 'Kan granskas från',
              reviewPostponedUntil: 'Fördröjd till',
              delayComment: 'Kommentar',
              by: 'av',
            }
          }
        },
        published: {
          numberOfHits: 'Antal träffar',
        },
        start: {
        },
        search: {
          searchForPublicationWithPubid: 'Sök efter publikation med GUP-ID:',
          searchById: 'Sök efter GUP-ID',
        },
        new: {
          header: 'Registrera ny publikation',
          importPub: {
            header: 'Importera',
            ingress: 'Använd ett ID för att importera publikationsuppgifter från en extern källa, tex PubMed, Scopus eller Libris.',

            form: {
              selectImportSourcePrompt: 'Välj typ av ID',
              inputId: {
                placeholder: 't.ex. ',
              },
              fetchButton: 'Hämta'
            },
            importConfirmation: {
              header: 'Vill du importera följande post:',
              title: 'Titel:',
              author: 'Författare:',
              btnImport: 'Importera',
                  duplicateMessage: 'Posten verkar redan vara publicerad!'
            }
          },
          manualPub: {
            header: 'Har du ingen källa att importera från?',
            ingress: 'Skapa en ny publikation och mata in informationen manuellt.',
            btnNew: 'Skapa ny',
            linkNew: 'skapa ny författare',
                addAffiliation: "Ändra affiliering"
          }
        },


      },
      review: {
      },
      biblreview: {
        numberOfHits: 'Antal träffar',
        selectPublicationTypePrompt: 'Alla typer',
        selectPublicationYearPrompt: 'Alla år',
        selectFacultyPrompt: 'Alla fakulteter',
        orLater: 'och senare',
        orEarlier: 'och tidigare',
        pubid: 'Pubid',
        title: 'Titel',
        year: 'År',
        pubtype: 'Pub-typ',
        delay: 'Fördröj',
        delayHeader: 'Fördröj granskning av publikation',
        date: 'Datum',
        comment: 'Kommentar',
        btnDelay: 'Fördröj',
        showDelayedOnly: 'Visa endast fördröjda',
      },
      touched: {
      },
      loading: {
      },
      admin: {
        admin_departments: 'Administrera institutioner',
        admin_people: 'Administrera personer',
        admin_messages: 'Administrera meddelanden',
      },
    },
    publicationtypes: {
      selector: {
      },
      form: {
      }
    },
    index: {
    }
  },
  footer: {
  },
  admin: {
    departments: {
      new: {
      },
      index: {
      }
    },
    person: {
      edit: {
      }
    },
    people: {
    },
    messages: {
    }
  }
};
