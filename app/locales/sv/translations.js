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
          youHaveNoPublications: 'Du har inga publikationer.',
        },
        start: {
        },
        search: {
          searchForPublicationWithPubid: 'Sök efter publikation med GUP-ID:',
          searchById: 'Sök efter GUP-ID',
        },
        new: {
          btnBack: "Tillbaka",
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
        youHaveNoPublicationsForReview: 'Du har inga publikationer att granska',
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
        numberOfHits: 'Antal träffar',
        youHaveNoRegisteredOrEditedPublications: 'Du har inte registrerat eller redigerat några publikationer.',
      },
      loading: {
      },
    },
    publicationtypes: {
      selector: {
        selectorHeading: "Välj publikationstyp",
        btnCancel: 'Avbryt',
        publicationtype: {
          all: 'Alla',
          articles: 'Artiklar',
          books: 'Böcker, kapitel och rapporter',
          conference: 'Konferensbidrag',
          artworks: 'Konstnärliga arbeten',
          other: 'Övrigt',
        },


      },
      form: {
        publicationType: 'Publikationstyp',
        changePublicationTypeLink: 'Byt',
        help: {
          authors: {
            helptext: 'Här skriver du in samtliga författare i samma ordningsföljd som i originalpublikationen. För GU-författare skriver du in fullständigt namn samt anger institution, för övriga författare räcker det med efternamn samt förnamnets första bokstav. Sök bland författarna som redan finns inlagda innan du väljer att lägga till en ny.',
          },
          category_hsv_local: {
            helptext: 'Välj minst en ämneskategori för din publikation. För mer information se http://www.ub.gu.se/publicera/'
          },
          pub_notes: {
            helptext: 'Här skriver du endast in information som inte passar i något annat fält. Observera att denna text är synlig för de som söker fram publikationen.'
          },
          publicationIdentifiers: {
            helptext: 'Att lägga till en identifikator gör det både lättare för andra att hitta din publikation och att bekräfta att de hittat rätt. I slutändan kan detta alltså leda till att fler personer läser din publikation.',
          },
          publisher: {
            placeholder: 'T ex "Journal of testing" eller ISSN 1234-5678',
          },
        }
       
      }
    },
    index: {
    }
  },
  footer: {
  },
  admin: {
    admin_departments: 'Administrera institutioner',
    admin_people: 'Administrera personer',
    admin_messages: 'Administrera meddelanden',
    departments: {
      query_department: 'Sök institution',
      query_department_none: 'Ingen institution hittades',
      btnNew: 'Skapa ny',
      btnSave: 'Spara',
      btnCancel: 'Avbryt',
      btnRemoveEndYear: 'Ta bort slutår',
      btnEditEndYear: 'Redigera slutår',
      modalHeader: 'Sätt slutår',
      id: 'Id',
      name_sv: 'Svenskt namn',
      name_en: 'Engelskt namn',
      start_year: 'Startår',
      end_year: 'Slutår',

      new: {

      },
      index: {
      }
    },

    people: {
      id: 'Id',
      first_name: 'Förnamn',
      last_name: 'Efternamn',
      xaccount: 'Xkonto',
      orcid: 'ORCID',
      birthyear: 'Födelseår',
      btnEdit: 'Redigera',
      btnSave: 'Spara',
      btnDelete: 'Radera',
      query_person: 'Sök person',
      query_person_none: 'Inga personer hittades',

      person: {
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
            }

          }

      }
    },

    },
    messages: {
      newsMessageHeader: 'Nyhetsmeddelande',
      alertMessageHeader: 'Driftmeddelande',
      message: 'Meddelande',
      start_date: 'Startdatum',
      end_date: 'Slutdatum',
      save: 'Spara',
      delete: 'Radera',
      saved: 'Meddelandet har sparats',
      deleted: 'Meddelandet har raderats',
      saveError: 'Kunde inte spara meddelandet',
      deleteError: 'Kunde inte radera meddelandet'
    }
  }
};
