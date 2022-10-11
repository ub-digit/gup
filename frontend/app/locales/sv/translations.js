export default {
  components: {
    publicationTypeItem: {
      suggested: 'Föreslagen',
      current: 'Vald'
    },
    multipleItems: {
      addItemText: 'Lägg till',
      deleteItemText: 'Ta bort'
    },
    fileUploadWidget: {
      openModalLabel: 'Ladda upp fil',
      modalTitle: 'Ladda upp ny fil',
      chooseFileLabel: 'Välj fil',
      cancelLabel: 'Avbryt',
      submitLabel: 'Spara fil'
    },
    confirmationModal: {
      modalTitle: 'Bekräfta',
      cancelText: 'Avbryt',
      confirmText: 'Ok',
      unknownError: 'Något gick fel'
    },
    publicationIdentifierBlock: {
      prompt: 'Välj typ',
      label: 'Identifikatorer',
      code: 'Typ',
      value: 'Värde',
      delete: 'Ta bort',
      create: 'Lägg till'
    },
    authorBlock: {
      btnAddNewAuthor: 'Lägg till författare',
      invalidSelectedInstitutionsWarning: 'En eller flera författare har institutioner som inte längre är valbara på grund av att publikationsår har ändrats. ',
      mandatory: '(obligatoriskt)',
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
      publicationIDLabel: 'Publikations-ID',
      publishedInLabel: 'Publicerad i',
      filesLabel: 'Filer',
      linksLabel: 'Länkar',
      publicationIdentifier: {
        label: 'Identifikatorer',
      },
    },
    mailerModal: {
      report: 'GUP-support',
      description: 'Här skickar du meddelanden till GUP-supporten. Ange din e-post om du vill få feedback.',
      send: 'Skicka',
      dismiss: 'Avbryt',
      message: 'Meddelande',
      successMessage: 'Meddelandet skickades.',
    },
    reviewItem: {
      reviewDetailsHeader: 'Granska och godkänn följande:',
      lastReview: 'Senast granskad av dig:',
      comment: 'Kommentar:',
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
      mandatory: '(obligatoriskt)',
      radioLabel1: 'Välj från lista',
      radioLabel2: 'Ange som fritext',
      aheadCheckbox: 'Ange om publikationen är en Epub ahead of print',
      refCheckbox: 'Ange om publikationen är refereegranskad',
    },
    publicationListRow: {
      noTitle: '-- Titel saknas --',
      publishedInLabel: 'Publicerad i',
      authorLabel: 'Författare',
      publicationID: "Publikationens id",
      publicationType: "Publikationstyp",
      publicationYear: "Publikationsår",
      contentMarker: "Innehållsmärkning",
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
      orcid: {
        label: 'Orcid',
        placeholder: 't ex 0000-0002-3843-3472',
      },
      btnSave: 'Spara',
      btnCancel: 'Avbryt',
      selectAuthor: {
        label: 'Välj författare',
        placeholder: 'Välj författare',
        typeaheadSearchingText: 'Söker författare',
        typeaheadNoMatchesText: 'Hittade inga författare',
        didNotFindPersonText: 'Finns inte författaren?',
        formatInputTooShortText: 'Ange minst 3 tecken',
        btnCreateNew: 'Skapa en ny',
      },
      suggestedDepartments: {
        label: 'Förslag på instutitioner'
      },
      invalidSelectedDepartments: {
        label: 'Institutioner ej längre valbara detta år',
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
    categoryItem: {
    },
  },

  wildcard: {
    displaytext: '404 - vi kunde inte hitta sidan',
    linktext: 'Gå till startsidan'
  },

  header: {
  },


  login: {
    title_page: 'Logga in',
    header: 'Logga in',
    button: 'Logga in',
    username: 'x-konto',
    usernamePlaceholder: 'x-konto',
    password: 'Lösenord',
    passwordPlaceholder: 'Lösenord',
    loginError: "Fel användarnamn eller lösenord. Vänligen försök igen.",
    extraLoginMessage: 'Vi upplever problem med inloggningen till GUP och rekommenderar att byta lösenord till medarbetarportalen.<br/>Se nyheten på GU:s webb: https://medarbetarportalen.gu.se/aktuellt/nyheter-detalj/paminnelse-om-losenordsbyte-.cid1573123'
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
    publications_list: 'Publikationslistor',
    lang: 'English',
    logOut: 'Logga ut',
    idMissing: 'Ogiltigt ID'
  },
  application: {
    title: "Göteborgs universitets publikationer"
  },
  msgheader: {
  },
  publication: {
    linkToHandlePublication: "Hantera (kräver inlogging)",
    not_found: "Publikationen kunde inte hittas"
  },

  publications_list: {
    header_text: "Filtrera publikationslistan",
    title_page: 'Publikationslista',
    numberOfHits: 'Antal publikationer',
    sortByPreLabel: 'Sortera',
    zeroPublications: 'Listan saknar publikationer',
    sortByYearLabel: 'År',
    sortByTitleLabel: 'Titel',
    sortByPubTypeLabel: 'Publikationstyp',
    sortByFirstAuthorLabel: 'Författarnamn',
    startYearLabel: 'Startår',
    endYearLabel: 'Slutår',
    onlyRefLabel: 'Endast refereegranskade publikationer',
    searchAuthorLabel: 'Författare',
    searchDepartmentLabel: 'Institution',
    selectFacultyLabel: 'Fakultet',
    selectFacultyDropdown: 'Välj fakultet',
    searchPublicationsType: 'Publikationstyp',
    searchProject: 'Projekt (EU-finansierat)',
    searchSerie: 'Serie (GU)',
    export_as_ris: 'Ladda ner träfflistan (.ris)'
  },

  publications: {
    dashboard: {
      reports: {
        filter: "Filter",
        description: "Här får du statistik för publikationer med affiliering till Göteborgs Universitet. Markera önskade urvalskriterier. För utskrift ange Exportera till Excel.",
        title: "Rapporter",
        select_criteria: "Välj kriterier",
        export_csv: "Exportera till Excel",
        year: "År",
        start_year: "Startår (ex. 1999)",
        end_year: "Slutår (ex. 2010)",
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
        clearBtn: 'Rensa filter',
      },
      manage: {
        _subnav: {
          published: 'Mina publikationer',
          drafts: 'Mina utkast',
          search: 'Sök',
          file_import: 'Importera från referenslistor',
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
            systemError: 'Ett systemfel har inträffat',
            approveSuccess: 'Posten har godkänts.',
            invalidSelectedInstitutionsWarning: 'Institutionen för en eller flera författare har ändrats. Vill du spara ändå?',
            invalidSelectedInstitutionsWarningConfirm: 'Spara',
            invalidSelectedInstitutionsWarningCancel: 'Återgå',
            confirm: 'Du har inte lagt till någon GU-institution till författare. Vill du spara ändå?'
          },
          index: {
            errorMissingPublication: 'Publikationen saknas',
            btnBack: 'Tillbaka',
            reviewModeInfo: 'Du tittar på posten i granskningsläge.',
            reviewModeCancel: 'Tillbaka till visningsläge. ',
            deletePublicationSuccess: 'Publikationen borttagen.',
            deletePublicationError: 'Publikationen kunde inte tas bort.',
            approvePublicationSuccess: 'Publikationen godkänd.',
            approvePublicationError: 'Publikationen kunde inte godkännas.',
            confirmDeletePublication: 'Är du säker på att du vill ta bort publikationen?',
            epubAheadOfPrintSince: 'E-pub ahead of print',
            postponed_comment: 'Posten är fördröjd:',
            saveAssetDataSuccess: 'Filen sparades',
            _subnav: {
              permalink: 'Länka till publikationen',
              checkFile: 'Kontrollera fil',
              enterEmbargoDate: 'Ange embargotid',
              showAfter: 'Visa offentligt först efter',
              approveAgreement: 'Jag har läst avtalet för elektronisk publicering och godkänner det.',
              readAgreement: 'Läs avtalet (nytt fönster)',

              edit: 'Redigera',
              delete: 'Radera',
              reviewMode: 'Granskningsläge',
              viewMode: 'Visningsläge',
              delay: 'Fördröj',
              biblreview: 'Markera som granskad',
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
            },
          },
        },
        published: {
          title: "Mina publikationer",
          numberOfHits: 'Antal träffar',
          youHaveNoPublications: 'Du har inga publikationer.',
          sortByPreLabel: 'Sortering',
          sortByTitleLabel: "Titel (A-Ö)",
          sortByYearLabel: "År (fallande)"
        },
        start: {
        },
        search: {
          title: "Sök",
          searchPublications: 'Sök efter publikationer',
          searchBy: 'Sök på titel, författare eller identifikatorer',
          loading: "Sökning pågår...",
          numberOfHits: 'Antal träffar',
          noPublicationsFound: 'Inga publikationer hittades'
        },
        fileImports: {
          youHaveNoUploadedList: 'Du har inga uppladdade referenslistor. Börja med att ladda upp en fil.',
          title: 'Uppladdade listor',
          filenameHeader: 'Filnamn',
          importedDateHeader: 'Importerad', //TODO: should be created/uploaded?
          publicationTitleHeader: 'Titel',
          publicationIdHeader: 'ID',
          delete: 'Ta bort',
          confirmDelete: 'Ta bort',
          deletionSuccess: 'Filen "{{filename}}" har tagits bort',
          deletionError: 'Något gick fel när "{{filename}}" skulle tas bort',
          expand: 'Visa innehåll',
          collapse: 'Dölj innehåll',
          importRecord: 'Registrera',
          importRecordStatusHeader: 'Status',
          importingRecord: 'Importerar...',
          deleteFileConfirmation: 'Är du säker på att du vill ta bort "{{filename}}"?', //How wrap filename in <strong>?
          deleteFileSubmitText: 'Radera',
          uploadSubmitLabel: 'Ladda upp',
          uploadCancelLabel: 'Avbryt',
          uploadCloseLabel: 'Stäng', //TODO: remove Label?
          uploadAnotherFile: 'Ladda upp ännu en fil',
          successfulFileUpload: 'Filen har laddats upp',
          possibleDuplicates: {
            'one': 'Möjlig dubblett',
            'other': 'Möjliga dubbletter'
          },
          processState: {
            DRAFT: 'Utkast',
            PUBLISHED: 'Publicerad'
          }
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
              pubyear: 'Publikationsår:',
              btnImport: 'Importera',
              duplicateMessage: 'Posten verkar redan vara publicerad!'
            },
          },
          manualPub: {
            header: 'Har du ingen källa att importera från?',
            ingress: 'Skapa en ny publikation och mata in informationen manuellt.',
            btnNew: 'Skapa ny',
            linkNew: 'skapa ny författare',
            addAffiliation: "Ändra affiliering"
          },
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
        noPublicationsForReview: 'Inga publikationer att granska',
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
        refereeLable: 'Refereegranskad',
        changePublicationTypeLink: 'Byt',
        publicationLinksLabel: 'Externa länkar',
        publicationLinksAddItem: 'Lägg till länk',
        generalErrorHeader: 'Formuläret innehåller felaktigheter. Var vänlig rätta till dessa och försök igen.',
        help: {
          publicationLinks: 'Länkar bör inledas med http:// eller https://',
          authors: {
            helptext: 'Ange samtliga författare i ordningsföljd enligt originalpublikationen. För GU-författare skriv fullständigt namn samt <strong>den affiliering som angivits i publikationen</strong>. För övriga författare är efternamn samt förnamnets initial tillräckligt. Sök bland författarna som redan finns inlagda innan du väljer att lägga till en ny.',
          },
          category_hsv_local: {
            helptext: 'Välj minst en ämneskategori för din publikation. För mer information se http://www.ub.gu.se/publicera/'
          },
          project: {
            helptext: 'Om publikationen är en del av ett forskningsprojekt som finansieras av EU skriver du in projektnamnet här.'
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
      },
    },
    index: {
    },
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
      faculty_header: 'Fakultet',
      name_sv: 'Svenskt namn',
      name_en: 'Engelskt namn',
      children_sv: 'Underliggande institutioner på svenska',
      children_en: 'Underliggande institutioner på engelska',
      no_children: 'Det saknas underliggande institutioner',
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
        },
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
          list: {
            affiliations_heading: 'Affilieringar',
            publications_heading: 'Publikationer',
            lang_name_en: 'Engelska:',
            lang_name_sv: 'Svenska:'
          },
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
    },
  },
};
