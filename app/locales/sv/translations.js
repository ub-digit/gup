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
      mandatory: '(obligatorisk)',

      authorHeaderTextStrong: {
            'default': 'Författare',
            'publication_edited-book': 'Redaktör',
            'publication_journal-issue': 'Redaktör',
            'conference_proceeding': 'Redaktör',
            'publication_textcritical-edition': 'Redaktör'
      },
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
      approveSuccess: 'Posten har godkänts.',
      approveError: 'Posten kunde inte godkännas.',
    },
    publicationtypeItem: {
    },
    fieldComponent: {
      radioLabel1: 'Välj från lista',
      radioLabel2: 'Ange som fritext',

    },
    publicationListRow: {
      noTitle: '-- Titel saknas --',
      publicationID: "Publikationens id",
      publicationType: "Publikationstyp",
      contentMarker: "Innehållsmärkning",
      createdAt: "Skapad",
      published: "Publiserad",
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
      delaySuccess: "Granskningsgodkännandet har uppskjutits.",
      delayError: "Posten kunde inte fördröjas."
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
    loginError: "Fel användarnamn eller lösenord. Vänligen försök igen.",
  },
  mainMenu: {
    applicationName: 'GUP',
    publications: 'Publikationer',
    forReview: 'Att granska',
    forBReview: 'Bibl. granskn.',
    registeredOrEditedByMe: 'Mina registreringar',
    dropdownOther: "Övrigt",
    admin: 'Admin',
    reports: 'Statistik',
    lang: 'English',
    logOut: 'Logga ut',
    
    idMissing: 'Ogiltigt ID'

  },
  application: {
    title: "GUP",
  },
  msgheader: {
  },
  publications: {
    dashboard: {
      reports: {
        title: "Rapporter",
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
        groupingHeader: 'Ordna efter (gruppering)',
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
          title: "Mina utkast",
          numberOfHits: 'Antal träffar',
          youHaveNoDrafts: 'Du har inga utkast.',
          saveDraftSuccess: 'Posten har sparats som utkast.',
          saveDraftError: 'Posten kunde inte sparas som utkast.',
          deleteDraftSuccess: 'Utkast borttaget.',
          deleteDraftError: 'Utkastet kunde inte tas bort.',
          confirmDeleteDraft: 'Är du säker på att du vill ta bort utkastet?',
        },
        show: {
          title: "Visa publikation",
          publicationNotFound: 'Publikationen finns inte.',
          edit: {
            title: "Redigera publikation",
            btnCancel: 'Avbryt',
            btnSaveDraft: 'Spara utkast',
            btnSaveAndPublish: 'Spara och publicera',
            saveDraftSuccess: 'Posten har sparats som utkast.',
            saveDraftError: 'Posten kunde inte sparas som utkast.',
            deleteDraftSuccess: 'Utkast borttaget.',
            deleteDraftError: 'Utkastet kunde inte tas bort.',
 
            publishSuccess: 'Posten har publicerats.',
            publishError: 'Posten kunde inte publiceras.',
            approveSuccess: 'Posten har godkänts.',
          },
          index: {
            btnBack: 'Tillbaka',
            reviewModeInfo: 'Du tittar på posten i granskningsläge.',
            reviewModeCancel: 'Tillbaka till visningsläge. ',

            deletePublicationSuccess: 'Publikationen borttagen.',
            deletePublicationError: 'Publikationen kunde inte tas bort.',
            approvePublicationSuccess: 'Publikationen godkänd.',
            approvePublicationError: 'Publikationen kunde inte godkännas.',
            confirmDeletePublication: 'Är du säker på att du vill ta bort publikationen?',
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
          title: "Mina publikationer",
          numberOfHits: 'Antal träffar',
          youHaveNoPublications: 'Du har inga publikationer.',
        },
        start: {
        },
        search: {
          title: "Sök",
          searchForPublicationWithPubid: 'Sök efter publikation med GUP-ID:',
          searchById: 'Sök efter GUP-ID',
        },
        new: {
          title: "Ny publikation",
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
        title: "Granskning",
        youHaveNoPublicationsForReview: 'Du har inga publikationer att granska',

      },
      biblreview: {
        title_page: "Bibliografisk granskning",
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
        title: "Mina redigerade publikationer",
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
      title: "Administrera institutioner",
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
        title: "Skapa ny institution",
        btnBack: 'Tillbaka',
        header: 'Skapa ny institution',
        save: 'Skapa institution',
        noFaculty: 'Ingen fakultet',
        labels: {
          nameSv: 'Namn (Svenska)',
          nameEn: 'Namn (Engelska)',
          startYear: 'Startår',
          endYear: 'Slutår',
          faculty: 'Fakultet',
        }
      },
      index: {
        invalidYear: "Ogiltigt årtal",
        saveError: "Kunde inte spara"
      },
    },

    people: {
      title: "Administrera personer",
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
      index: {
        confirmDeletePerson: 'Är du säker på att du vill ta bort personen?'
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
            }

          }

      }
    },

    },
    messages: {
      title: "Administrera meddelanden",
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
