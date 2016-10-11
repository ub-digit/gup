export default {
  components: {
    publicationIdentifierBlock: {
    },
    authorBlock: {
      btnAddNewAuthor: 'Lägg till författare',
    },
    publicationFieldFiles: {
    },
    publicationFieldPreview: {
    },
    paginationPager: {
    },
    categorySelector: {
    },
    publicationFieldCompare: {
    },
    publicationDisplay: {
    },
    mailerModal: {
    },
    reviewItem: {
    },
    publicationtypeItem: {
    },
    fieldComponent: {
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
    },
    delayReviewModal: {
    },
    debouncedInput: {
    },
    fileUploadWidget: {
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
