PublicationType.find_by_code("publication_journal-article").update_attributes({label_sv: "Artikel i vetenskaplig tidskrift", description_sv: "Avser artikel som granskats av oberoende referenter (i refereegranskad tidskrift, peer review)."})
PublicationType.find_by_code("publication_review-article").update_attributes({label_sv: "Forskningsöversiktsartikel", description_sv: "Avser refereegranskad översiktsartikel i vetenskaplig tidskrift."})
PublicationType.find_by_code("publication_editorial-letter").update_attributes({label_sv: "Inledande text i tidskrift", description_sv: "Avser inledande presentationstext i tidskrift eller proceeding, som en åsikts- eller policyförklaring (letters, editorials, comments, notes)."})
PublicationType.find_by_code("publication_book-review").update_attributes({label_sv: "Recension", description_sv: "Avser recension av bok (book review) i tidskrift eller dagstidning."})
PublicationType.find_by_code("publication_magazine-article").update_attributes({label_sv: "Artikel i övriga tidskrifter", description_sv: "Avser artikel i tidskrifter som inte är refereegranskade vetenskapliga tidskrifter."})
PublicationType.find_by_code("publication_book").update_attributes({label_sv: "Bok", description_sv: "Avser monografisk publikation bestående av en eller flera delar. Använd detta alternativ när författaren är upphovsman till hela verket, använd annars \"kapitel i bok\". Du kan märka upp om publikationen är refereegranskad eller ej."})
PublicationType.find_by_code("publication_textbook").update_attributes({label_sv: "Lärobok", description_sv: "Avser en bok som används i undervisning samt är begränsad till ett visst ämne."})
PublicationType.find_by_code("publication_textcritical-edition").update_attributes({label_sv: "Textkritisk utgåva", description_sv: "Avser utgåvor inom humaniora som innehåller en vetenskaplig textetablering i relation till tidigare forskning samt med kommentarer till det utgivna verkets helhet eller delar."})
PublicationType.find_by_code("publication_book-chapter").update_attributes({label_sv: "Kapitel i bok", description_sv: "Avser självständigt bidrag i monografisk publikation, ofta samlingsverk. Du kan märka upp om publikationen är refereegranskad eller ej."})
PublicationType.find_by_code("publication_doctoral-thesis").update_attributes({label_sv: "Doktorsavhandling", description_sv: "Avser godkänd avhandling för doktorsexamen."})
PublicationType.find_by_code("publication_report").update_attributes({label_sv: "Rapport", description_sv: "Avser publikation som kan ingå som en del i en rapportserie."})
PublicationType.find_by_code("conference_paper").update_attributes({label_sv: "Paper i proceeding", description_sv: "Avser refereegranskat bidrag i sin helhet, publicerat i en proceedings."})
PublicationType.find_by_code("conference_other").update_attributes({label_sv: "Konferensbidrag (offentliggjort, men ej förlagsutgivet)", description_sv: "Offentliggjort, men ej förlagsutgivet bidrag på konferenswebbsida/-databas, key notes, invited speeches, abstracts och powerpoints."})
PublicationType.find_by_code("publication_edited-book").update_attributes({label_sv: "Samlingsverk (red.)", description_sv: "Avser publikations av typen antologi eller samlingsverk med redaktör. Du kan märka upp om publikationen är refereegranskad eller ej."})
PublicationType.find_by_code("publication_report-chapter").update_attributes({label_sv: "Kapitel i rapport", description_sv: "Avser kapitel i rapporter, exempelvis rapportserier."})
PublicationType.find_by_code("publication_newspaper-article").update_attributes({label_sv: "Artikel i dagstidning", description_sv: "Avser artikel i dags-/nyhetstidning som vänder sig till allmänheten."})
PublicationType.find_by_code("publication_encyclopedia-entry").update_attributes({label_sv: "Bidrag till encyklopedi", description_sv: "Avser bidrag till encyclopedi eller referensverk där författaren är namngiven. Du kan märka upp om publikationen är refereegranskad eller ej."})
PublicationType.find_by_code("publication_licentiate-thesis").update_attributes({label_sv: "Licentiatsavhandling", description_sv: "Avser godkänd avhandling för licentiatexamen."})
PublicationType.find_by_code("publication_journal-issue").update_attributes({label_sv: "Special / temanummer av tidskrift (red.)", description_sv: "Avser namngivna redaktörer (guest editors) till special-/temanummer av tidskrift."})
PublicationType.find_by_code("conference_poster").update_attributes({label_sv: "Poster (konferens)", description_sv: "Avser bidrag till ’poster session’."})
PublicationType.find_by_code("conference_proceeding").update_attributes({label_sv: "Proceeding (red.)", description_sv: "Avser redaktörskap för konferensproceedings. Du kan märka upp om publikationen är refereegranskad eller ej."})
PublicationType.find_by_code("intellectual-property_patent").update_attributes({label_sv: "Patent", description_sv: "Avser godkänt patent."})
PublicationType.find_by_code("publication_working-paper").update_attributes({label_sv: "Working paper", description_sv: "Avser bidrag utgivna i working paper-serier."})
PublicationType.find_by_code("artistic-work_original-creative-work").update_attributes({label_sv: "Konstnärligt arbete", description_sv: "Arbete som har genomgått sakkunniggranskning på Konstnärliga fakulteten och fått antingen 1 eller 5 poäng. Registreras enbart av UB."})
PublicationType.find_by_code("artistic-work_scientific_and_development").update_attributes({label_sv: "Konstnärligt forsknings- och utvecklingsarbete", description_sv: "Arbete från ett konstnärligt forsknings- och/eller utvecklingsprojekt. Gäller t.o.m. 2011"})
PublicationType.find_by_code("other").update_attributes({label_sv: "Övrigt", description_sv: "Används endast när ingen annan publikationstyp kan tillämpas."})

PublicationType.find_by_code("publication_journal-article").update_attributes({label_en: "Journal article", description_en: "States that the article has been assessed by external independent reviewers and published in a scholarly journal."})
PublicationType.find_by_code("publication_review-article").update_attributes({label_en: "Review article", description_en: "Refers to a review article that has undergone external reviewing."})
PublicationType.find_by_code("publication_editorial-letter").update_attributes({label_en: "Editorial letter", description_en: "Refers to an editorial text for a journal or proceedings (including letters, comments, notes)."})
PublicationType.find_by_code("publication_book-review").update_attributes({label_en: "Book review", description_en: "Refers to book reviews in journals or newspapers."})
PublicationType.find_by_code("publication_magazine-article").update_attributes({label_en: "Magazine article", description_en: "Articles that have been published in either a scientific journal without peer review or another type of journal."})
PublicationType.find_by_code("publication_book").update_attributes({label_en: "Book", description_en: "A monographic publication, either in physical form or as an e-book, is defined by the fact that the author has written the whole text. Please use checkbox for marking up if this publication is peer reviewed or not."})
PublicationType.find_by_code("publication_textbook").update_attributes({label_en: "Textbook", description_en: "Refers to a book which is about a particular subject and is used as a teaching element."})
PublicationType.find_by_code("publication_textcritical-edition").update_attributes({label_en: "Text critical edition (editor)", description_en: "Editions within the humanities with a scholarly text establishment with regard to previous research and with comments to the whole or parts of the edited work."})
PublicationType.find_by_code("publication_book-chapter").update_attributes({label_en: "Chapter in book", description_en: "Independent part of a monographic publication, often a compilation or anthology. Please use checkbox for marking up if this publication is peer reviewed or not."})
PublicationType.find_by_code("publication_doctoral-thesis").update_attributes({label_en: "Doctoral thesis", description_en: "Passed thesis for doctoral degree."})
PublicationType.find_by_code("publication_report").update_attributes({label_en: "Report", description_en: "Refers to a publication which can be part of a report series."})
PublicationType.find_by_code("conference_paper").update_attributes({label_en: "Conference paper", description_en: "Refers to a peer reviewed full length paper, published in proceedings with ISSN or ISBN."})
PublicationType.find_by_code("conference_other").update_attributes({label_en: "Conference contribution", description_en: "Contribution to a conference website/database, key notes, invited speeches, and powerpoint presentations."})
PublicationType.find_by_code("publication_edited-book").update_attributes({label_en: "Edited book", description_en: "Anthology or compilation which has an editor. Please use checkbox for marking up if this publication is peer reviewed or not."})
PublicationType.find_by_code("publication_report-chapter").update_attributes({label_en: "Report chapter", description_en: "Independent part of a report."})
PublicationType.find_by_code("publication_newspaper-article").update_attributes({label_en: "Newspaper article", description_en: "Refers to an article published in a newspaper."})
PublicationType.find_by_code("publication_encyclopedia-entry").update_attributes({label_en: "Encyclopedia entry", description_en: "Refers to contributions to an encyclopedia with the author mentioned. Please use checkbox for marking up if this publication is peer reviewed or not."})
PublicationType.find_by_code("publication_licentiate-thesis").update_attributes({label_en: "Licentiate thesis", description_en: "Passed thesis for licentiate degree."})
PublicationType.find_by_code("publication_journal-issue").update_attributes({label_en: "Journal issue", description_en: "(Guest) Editor for an entire special or theme issue of a journal."})
PublicationType.find_by_code("conference_poster").update_attributes({label_en: "Poster", description_en: "Conference contribution to a poster session."})
PublicationType.find_by_code("conference_proceeding").update_attributes({label_en: "Proceeding", description_en: "Editor for conference proceedings. Please use checkbox for marking up if this publication is peer reviewed or not."})
PublicationType.find_by_code("intellectual-property_patent").update_attributes({label_en: "Patent", description_en: "Granted patent."})
PublicationType.find_by_code("publication_working-paper").update_attributes({label_en: "Working paper", description_en: "Refers to contributions in a working paper series."})
PublicationType.find_by_code("artistic-work_original-creative-work").update_attributes({label_en: "Artwork", description_en: "A work that has been reviewed and appointed 1 or 5 points at the Faculty of Arts. This publication is only registered by the university library."})
PublicationType.find_by_code("artistic-work_scientific_and_development").update_attributes({label_en: "Artistic research and development", description_en: "Results from artistic research and/or development project. Valid until 2011."})
PublicationType.find_by_code("other").update_attributes({label_en: "Other", description_en: "Only to be used for publications where no other type is applicable."})
