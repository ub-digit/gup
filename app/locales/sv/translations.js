export default {
	mainMenu: {
		applicationName: 'GUP 3',
		lang: 'English',
		publications: 'Publikationer',
		logOut: 'Logga ut',
    searchById: 'Sök efter GUP-ID',
    idMissing: 'Ogiltigt ID'
	},
	footer: {
    copyright: "Göteborgs universitetsbibliotek",
    websiteLink: "Bibliotekets webbplats"    
  },
	login: {
		xaccount: 'x-konto',
		xaccountPlaceholder: 'x-konto',
		password: 'Lösenord',
		passwordPlaceholder: 'Lösenord',
		button: 'Logga in'
	},
	publication: {
		labels: {
		  publications: 'Publikationer',
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
		  noTitle: '[Ingen titel]'
		},
		show: {
			edit: "Redigera",
			"delete": "Radera",
			biblreview: "Markera som granskad"
		}
	},
	messages: {
		saveDraftSuccess: 'Posten har sparats som utkast.',
		saveDraftError: 'Posten kunde inte sparas som utkast.',
		deleteDraftSuccess: 'Utkast borttaget.',
		deleteDraftError: 'Utkastet kunde inte tas bort.',
		deletePublicationSuccess: 'Publikationen borttagen.',
		deletePublicationError: 'Publikationen kunde inte tas bort.',
		approvePublicationSuccess: 'Publikationen godkänd.',
		approvePublicationError: 'Publikationen kunde inte godkännas.',
		confirmDeleteDraft: 'Är du säker på att du vill ta bort utkastet?',
		confirmDeletePublication: 'Är du säker på att du vill ta bort publikationen?',
		publishSuccess: 'Posten har publicerats.',
		publishError: 'Posten kunde inte publiceras.',
		approveSuccess: 'Posten har godkänts.',
		approveError: 'Posten kunde inte godkännas.',
		delaySuccess: 'Granskningsgodkännandet har uppskjutits.',
		delayError: 'Posten kunde inte fördröjas.',
		publicationNotFound: 'Publikationen finns inte.',
    invalidYear: 'Felaktigt årtal',
    saveDepartmentError: 'Kunde inte spara',
		confirmDeletePerson: 'Är du säker på att du vill ta bort personen?',
    personChangeWarningAfterEdit: 'Innehållet i sökresultatet kan ha förändrats p g a redigeringen.'
	},
	text: {
		youHaveNoDrafts: 'Du har inga utkast.',
		youHaveNoPublications: 'Du har inga publikationer.',
		youHaveNoRegisteredOrEditedPublications: 'Du har inte registrerat eller redigerat några publikationer.',
		youHaveNoPublicationsForReview: 'Du har inga publikationer att granska',
		reviewListPreamble: 'Forskare är skyldiga att granska och godkänna sina registrerade publikationer pga ett beslut som tagits.',
		start: 'Start',
		drafts: 'Mina utkast',
		registeredOrEditedByMe: 'Mina registreringar',
		published: 'Mina publikationer',
		forReview: 'Att granska',
		forBReview: 'Bibl. granskn.',
    numberOfHits: 'Antal träffar',
    admin: 'Admin',
    admin_departments: 'Administrera institutioner',
    admin_people: 'Administrera personer',
    query_department: 'Sök institution',
    query_department_none: 'Ingen institution hittades',
    query_person: 'Sök person',
    query_person_none: 'Inga personer hittades',
    person: {
      first_name: 'Förnamn',
      last_name: 'Efternamn',
      xaccount: 'Xkonto',
      orcid: 'ORCID',
      birthyear: 'Födelseår'
    },
    department: {
      modalHeader: 'Sätt slutår',
      name_sv: 'Svenskt namn',
      name_en: 'Engelskt namn',
      start_year: 'Startår',
      end_year: 'Slutår'
    }
	},
	tabTitle: {
		start: 'Start',
		drafts: 'Mitt arbetsmaterial: ännu ej publicerade registreringar.',
		registeredOrEditedByMe: 'Registrerade publikationer som jag har skapat eller ändrat.',
		published: 'Publikationer där jag finns med som författare.',
		forReview: 'Dessa publikationer måste godkännas av mig med avseende på ämnesord och affiliering.',
		forBReview: 'Dessa publikationer kräver bibliografisk granskning.',
    admin: 'Administrera data'
	},
	labels: {
		registerNew: 'Registrera ny',
		registerNewPublication: 'Registrera ny publikation:',
        searchForPublicationWithPubid: 'Sök efter publikation med GUP-ID:',
		back: 'Tillbaka'
	},
	review: {
		reviewDetailsHeader: 'Granska och godkänn följande:',
		lastReview: 'Senast granskad av dig:',
		publicationType: 'Publikationstyp:',
		contentType: 'Innehållsmärkning:',
		affiliation: 'Din affiliering:',
		categories: 'Ämnesord:',
		approve: 'Godkänn',
		approved: 'Godkänd',
		edit: 'Redigera',
    addedObject: 'Ny!'
	},
    biblreview: {
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
	edit: {
		header: 'Redigera publikation',
		actions: {
      btnEdit: 'Redigera',
      btnEditEndYear: 'Redigera slutår',
      btnRemoveEndYear: 'Ta bort slutår',
      btnSave: 'Spara',
      btnDelete: 'Radera',
			btnClose: 'Stäng',
			btnCancel: 'Avbryt',
			btnSaveDraft: 'Spara utkast',
			btnSaveAndPublish: 'Spara och publicera',
			btnSelect: 'Ok',
		},
		form: {
			selectPublicationTypePrompt: 'Välj publikationstyp',
			selectContentTypePrompt: 'Välj innehållsmärkning',
			selectContentTypeLabel: 'Innehållmärkning',
			changePublicationTypeLink: 'Byt publikationstyp',
			authorHeaderTextStrong: {
        'default': 'Författare',
        'conference-papers': 'Redaktör',
        'edited-book': 'Redaktör',
        'journal-issue': 'Redaktör'
      },
			btnAddNewAuthor: 'Lägg till författare',
			possibleAuthorFoundText: 'Eventuell författare funnen:',
			selectAuthor: {
				label: 'Välj författare',
				placeholder: 'Välj författare',
				typeaheadSearchingText: 'Söker författare',
				typeaheadNoMatchesText: 'Hittade inga författare',
				didNotFindPersonText: 'Hittar du inte den du söker?',
				formatInputTooShortText: 'Ange minst 3 tecken',
				btnCreateNew: 'Skapa ny'
			},
			selectInstitutions: {
				label: 'Välj institutioner',
				placeholder: 'Välj institutioner',
				sortingLink: 'Sortera?'
			},
			selectCategory: {
        addCategory: 'Lägg till ämnesord',
        modalHeader: 'Välj 3 ämnesord',
        left: 'kvar',
        selectedCategories: 'Valda ämnesord:',
        noCategoriesSelected: 'Inga ämnesord valda',
        subjectTerms: 'Ämnesord',
        clear: 'Rensa',
        noFilteredSubjectTerms: 'Inga ämnesord matcher filtret',
        close: 'Stäng'
      }
		},
		createNewAuthor: {
			form: {
				labels: {
					firstname: 'Förnamn:',
					lastname: 'Efternamn:',
					birthyear: 'Födelseår:',
					xaccount: 'x-konto',
					orcid: 'Orcid'
				},
				placeholders: {
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
	newPub: {
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
  publicationIdentifier: {
    label: 'Identifikatorer',
    code: 'Typ',
    value: 'Värde',
    delete: 'Ta bort',
    create: 'Lägg till'
  },
  mailer: {
    report: 'Rapportera',
    send: 'Skicka rapport',
    message: 'Meddelande'
  }
};
