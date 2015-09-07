export default {
	mainMenu: {
		applicationName: 'GUP 3',
		lang: 'English',
		publications: 'Publikationer',
		logOut: 'Logga ut'
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
		  createdAt: 'Skapad',
		  updatedAt: 'Uppdaterad',
		  publishedAt: 'Publicerad',
			noTitle: '[Ingen titel]'
		}
	},
	messages: {
		saveDraftSuccess: 'Posten har sparats som utkast.',
		saveDraftError: 'Posten kunde inte sparas som utkast.',
		deleteDraftSuccess: 'Utkast borttaget.',
		deleteDraftError: 'Utkastet kunde inte tas bort.',
		confirmDeleteDraft: 'Är du säker på att du vill ta bort utkastet?',
		publishSuccess: 'Posten har publicerats.',
		publishError: 'Posten kunde inte publiceras.',
		approveSuccess: 'Posten har godkänts.',
		approveError: 'Posten kunde inte godkännas.'
	},
	text: {
		youHaveNoDrafts: 'Du har inga utkast.',
		youHaveNoPublications: 'Du har inga publikationer.',
		youHaveNoRegisteredOrEditedPublications: 'Du har inte registrerat eller redigerat några publikationer.',
		youHaveNoPublicationsForReview: 'Du har inga publikationer att granska',
		reviewListPreamble: 'Forskare är skyldiga att granska och godkänna sina registrerade publikationer pga ett beslut som tagits.',
		drafts: 'Utkast',
		published: 'Publicerade',
		registeredOrEditedByMe: 'Registrerade/redigerade av mig',
		forReview: 'Att granska'
	},
	labels: {
		registerNew: 'Registrera ny',
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
		edit: 'Redigera'
	},
	edit: {
		header: 'Redigera publikation',
		actions: {
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
			authorHeaderTextStrong: 'Författare',
			authorHeaderTextSoft: '(ange minst en)',
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
				btnImport: 'Importera'
			}
		},
		manualPub: {
			header: 'Har du ingen källa att importera från?',
			ingress: 'Skapa en ny publikation och mata in informationen manuellt.',
			btnNew: 'Skapa ny',
			linkNew: 'skapa ny författare'
		}

	}
};
