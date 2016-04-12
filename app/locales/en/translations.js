export default {
	mainMenu: {
		applicationName: 'GUP 3',
		lang: 'Svenska',
		publications: 'Publications',
    logOut: 'Log out',
    searchById: 'Search for PubID',
		idMissing: 'Missing ID'
	},
	login: {
		xaccount: 'x-account',
		xaccountPlaceholder: 'x-account',
		password: 'Password',
		passwordPlaceholder: 'Password',
		button: 'Log in'
	},
	publication: {
		labels: {
		  publications: 'Publications',
		  publicationType: 'Publication type',
		  createdAt: 'Created',
		  createdBy: 'Created by',
		  updatedAt: 'Uppdated',
		  updatedBy: 'Uppdated by',
		  publishedAt: 'Published',
		  reviewedAt: 'Reviewed',
		  reviewedBy: 'Reviewed by',
		  reviewStart: 'Review start',
		  delayComment: 'Comment',
		  noTitle: '[No title]'
		},
		show: {
			edit: "Edit",
			"delete": "Delete",
			biblreview: "Approve"
		}
	},
	messages: {
		saveDraftSuccess: 'The record has been saved as a draft.',
		saveDraftError: 'The record could not be saved as a draft.',
		deleteDraftSuccess: 'Draft deleted.',
		deleteDraftError: 'The draft could not be deleted.',
		deletePublicationSuccess: 'Publication deleted.',
		deletePublicationError: 'Publication could not be deleted.',
		approvePublicationSuccess: 'Publication approved.',
		approvePublicationError: 'Publication could not be approved.',
		confirmDeleteDraft: 'Are you sure you want to delete the draft?',
        confirmDeletePublication: 'Are you sure you want to delete the publication?',
		publishSuccess: 'The record has been published.',
		publishError: 'The record could not be published.',
		approveSuccess: 'The record has been approved.',
		approveError: 'The record could not be approved.',
		delaySuccess: 'Review approval has successfully been delayed.',
		delayError: 'Review approval could not be delayed.',
		publicationNotFound: 'Publication not found.',
    personChangeWarningAfterEdit: 'The search result may have changed due to editing.'
	},
	text: {
		youHaveNoDrafts: 'You have no drafts.',
		youHaveNoPublications: 'You have no published publications.',
		youHaveNoRegisteredOrEditedPublications: 'You have not registered or edited any publications.',
		youHaveNoPublicationsForReview: 'You have no publications pending review.',
		reviewListPreamble: 'Researchers are obliged to review and approve some aspects of their registered publications.',
		start: 'Start',
		drafts: 'My drafts',
		registeredOrEditedByMe: 'My registrations',
		published: 'My publications',
		forReview: 'Pending review',
		forBReview: 'Bibl. review.',
    numberOfHits: 'Number of hits',
    admin: 'Admin',
    admin_people: 'Administrate people',
    query_person: 'Query person',
    query_person_none: 'No people found',
    person: {
      first_name: 'First name',
      last_name: 'Last name',
      xaccount: 'Xaccount',
      orcid: 'ORCID',
      birthyear: 'Year of birth'
    }
	},
	tabTitle: {
		start: 'Start',
		drafts: 'Drafts: not yet published registrations.',
		registeredOrEditedByMe: 'Registered publications created or edited by me.',
		published: 'Publications where I am one of the authors.',
		forReview: 'These publications need my approval concerning category and affiliation.',
		forBReview: 'These publications demand bibliographiucal review.',
    admin: 'Administrate data'
	},
	labels: {
		registerNew: 'Register new',
		registerNewPublication: 'Register new publication:',
        searchForPublicationWithPubid: 'Search for publication with certain publication id:',
		back: 'Back'
	},
	review: {
		reviewDetailsHeader: 'Review and approve the following aspects:',
		lastReview: 'Last review by you:',
		publicationType: 'Publication type:',
		contentType: 'Content type:',
		affiliation: 'Your affiliation:',
		categories: 'Subject terms:',
		approve: 'Approve',
		approved: 'Approved',
		edit: 'Edit'
	},
    biblreview: {
        selectPublicationTypePrompt: 'All types',
        selectPublicationYearPrompt: 'All years',
        selectFacultyPrompt: 'All schools',
        orLater: 'and later',
        orEarlier: 'and earlier',
        pubid: 'Pubid',
        title: 'Title',
        year: 'Year',
        pubtype: 'Pub-type',
        delay: 'Delay',
        delayHeader: 'Delay publication review',
        date: 'Date',
        comment: 'Comment',
        btnDelay: 'Delay',
        showDelayedOnly: 'Show delayed only',
    },
	edit: {
		header: 'Edit publication',
		actions: {
      btnEdit: 'Edit',
			btnClose: 'Close',
			btnCancel: 'Cancel',
			btnSaveDraft: 'Save as draft',
			btnSaveAndPublish: 'Save and publish',
			btnSelect: 'Ok',
		},
		form: {
			selectPublicationTypePrompt: 'Select publication type',
			selectContentTypePrompt: 'Select content type',
			selectContentTypeLabel: 'Content type',
			changePublicationTypeLink: 'Change publication type',
      authorHeaderTextStrong: 'Authors',
      authorHeaderTextSoft: '(provide at least one)',
			btnAddNewAuthor: 'Add author',
			possibleAuthorFoundText: 'Probable author detected:',
			selectAuthor: {
				label: 'Choose author',
				placeholder: 'Choose author',
				typeaheadSearchingText: 'Searching for authors',
				typeaheadNoMatchesText: 'No authors found',
				didNotFindPersonText: 'Did you not find the one you were looking for?',
				formatInputTooShortText: 'Enter at least 3 charachters',
				btnCreateNew: 'Create new'
			},
			selectInstitutions: {
				label: 'Select departments',
				placeholder: 'Select departments',
				sortingLink: 'Sort?'
			},
      selectCategory: {
        addCategory: 'Add subject terms',
        modalHeader: 'Select 3 subject terms',
        left: 'left',
        selectedCategories: 'Selected subject terms:',
        noCategoriesSelected: 'No subject terms selected',
        subjectTerms: 'Subject terms',
        clear: 'Clear',
        noFilteredSubjectTerms: 'Found no matching subject terms',
        close: 'Close'
      }
		},
		createNewAuthor: {
			form: {
				labels: {
					firstname: 'First name:',
					lastname: 'Last name:',
					birthyear: 'Year of birth:',
					xaccount: 'x-account',
					orcid: 'Orcid'
				},
				placeholders: {
					firstname: 'First name:',
					lastname: 'Last name:',
					birthyear: 'Year or birth:',
					xaccount: 'x-account',
					orcid: 'Orcid'
				},
				actions: {
					btnSave: 'Save',
					btnCancel: 'Cancel'
				}

			}
		}
	},
	newPub: {
		header: 'Register new publication',
		importPub: {
			header: 'Import',
			ingress: 'Use an external ID to import publication data from an external source, e.g. PubMed, Scopus or Libris.',

			form: {
				selectImportSourcePrompt: 'Choose an ID',
				inputId: {
					placeholder: 'e.g. ',
				},
				fetchButton: 'Fetch'
			},
			importConfirmation: {
				header: 'Would you like to import the following record:',
				title: 'Title:',
				author: 'Author:',
				btnImport: 'Import',
        duplicateMessage: 'The publication appears to already be imported'
			}
		},
		manualPub: {
			header: 'Are you missing a source to import from?',
			ingress: 'Create a new record from scratch and enter the data manually.',
			btnNew: 'Create new',
			linkNew: 'Create new author'
		}

	},
  publicationIdentifier: {
    label: 'Identifiers',
    code: 'Type',
    value: 'Value',
    delete: 'Delete',
    create: 'Add'
  },
  mailer: {
    report: 'Report',
    send: 'Send report',
    message: 'Message'
  }

};
