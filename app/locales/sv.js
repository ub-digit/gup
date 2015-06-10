export default {
	mainMenu: {
		applicationName: 'GUP 3',
		lang: 'Engelska',
		publications: 'Publikationer',
		logOut: 'Logga ut'
	},
	login: {
		xaccount: 'x-konto',
		xaccountPlaceholder: 'x-konto (t ex xrasto)',
		password: 'Lösenord',
		passwordPlaceholder: 'Lösenord',
		button: 'Logga in'
	},
	publication: {
		labels: {
		  publications: 'Publikationer',
		  createdAt: 'Skapad',
		  updatedAt: 'Uppdaterad',
		  publishedAt: 'Publicerad'
		}
	},
	text: {
		youHaveNoDrafts: 'Du har inga utkast.',
		youHaveNoPublications: 'Du har inga publikationer.',
		youHaveNoRegisteredOrEditedPublications: 'Du har inga registrerat eller redigerat några publikationer.',
		drafts: 'Utkast',
		published: 'Publicerade',
		registeredOrEditedByMe: 'Registrerade/redigerade av mig'
	},
	labels: {
		registerNew: 'Registrera ny'
	},
	edit: {
		header: 'Registrera publikation',
		actions: {
			btnClose: 'Stäng',
			btnCancel: 'Avbryt',
			btnSaveDraft: 'Spara utkast',
			btnSaveAndPublish: 'Spara och publicera',
			btnSelect: 'Ok',
		},
		form: {
			selectPublicationTypePrompt: 'Välj publikationstyp',
			selectAuthor: {
				label: 'Välj författare',
				placeholder: 'Välj författare',
				typeaheadSearchingText: 'Söker författare',
				typeaheadNoMatchesText: 'Hittade inga författare'
			},
			selectInstitutions: {
				label: 'Välj institutioner',
				placeholder: 'Välj institutioner',
				sortingLink: 'Sortera?'
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
			ingress: 'Importera publikationsuppgifter från extern källa, tex PubMed, Scopus eller Web of Science.',
			form: {
				selectImportSourcePrompt: 'Välj källa',
				inputId: {
					placeholder: 'ID',
				}
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
			btnNew: 'Skapa ny'
		}

	}
};
