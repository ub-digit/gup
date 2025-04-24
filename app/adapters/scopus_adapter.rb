class ScopusAdapter
  attr_accessor :id, :title, :alt_title, :abstract, :keywords, :pubyear, :language, :issn, :eissn, :sourcetitle, :sourcevolume, :sourceissue, :sourcepages, :author, :doi_url, :extid, :xml, :datasource, :sourceid, :publication_identifiers
  
  # TODO: Proper types for Scopus needed
  PUBLICATION_TYPES = {
    "ar" => "publication_journal-article",
    "ip" => "publication_journal-article",
    "bk" => "publication_book",
    "bz" => "publication_magazine-article",
    "ch" => "publication_book-chapter",
    "cp" => "conference_paper",
    "cr" => "conference_other",
    "ed" => "publication_editorial-letter",
    "er" => "publication_magazine-article",
    "le" => "publication_editorial-letter",
    "re" => "publication_book-review"
  }

  include ActiveModel::Serialization
  include ActiveModel::Validations

  DOI_URL_PREFIX = 'http://dx.doi.org/'
  APIKEY = APP_CONFIG['datasource_api_keys']['scopus']


  def initialize hash
    @doi = hash[:doi]
    @xml = hash[:xml]
    parse_xml
  end

  def json_data  options = {}
    {
      title: title,
      alt_title: alt_title,
      abstract: abstract,
      pubyear: pubyear,
      keywords: keywords,
      #author: author,
      publanguage: Language.language_code_map(language),
      sourcetitle: sourcetitle,
      sourceissue: sourceissue,
      sourcevolume: sourcevolume, 
      sourcepages: sourcepages,
      issn: issn,
      eissn: eissn,
      publication_links: @publication_links,
      extid: extid,
      xml: xml,
      datasource: datasource,
      sourceid: sourceid,
      publication_identifiers: publication_identifiers
    }
  end
  def self.authors(xml)
    authors = []
    sequences = []
    xml.search('//abstracts-retrieval-response/authors/author').map do |author|
      sequence = author.attr('seq')
      next if sequences.include? sequence # Omit author if it is a duplication

      first_name = author.search('given-name').text
      last_name = author.search('surname').text
      full_author = author.search('indexed-name').text
      authors << {
        first_name: first_name,
        last_name: last_name,
        full_author_string: full_author
      }
      sequences << sequence
    end
    authors
  end
 
  # Try to match publication type from xml data into GUP type
  def self.publication_type_suggestion(xml)
    original_pubtype = xml.search('//abstracts-retrieval-response/coredata/subtype').text
    original_pubtype = original_pubtype.downcase.gsub(/[^a-z]/,'')
    return PUBLICATION_TYPES[original_pubtype]
  end

  def parse_xml
    @xml = force_utf8(@xml)

    xml = Nokogiri::XML(@xml).remove_namespaces!
    
    if xml.search('//service-error/status/statusText').text.present?
      error_msg = xml.search('//service-error/status/statusText').text
      puts "Error in ScopusAdapter: #{error_msg}"
      errors.add(:generic, "Error in ScopusAdapter: #{error_msg}")
      return
    end  

    @pubyear = ""
    if xml.search('//abstracts-retrieval-response/item/bibrecord/head/source/publicationdate/year').text.present?
      @pubyear = xml.search('//abstracts-retrieval-response/item/bibrecord/head/source/publicationdate/year').text
    end

    @abstract = xml.search('//abstracts-retrieval-response/item/bibrecord/head/abstracts/abstract/para').text

    @keywords = xml.search('//abstracts-retrieval-response/authkeywords/author-keywordtest').map do |keyword|
      keyword.text
    end.join(", ")

    @title = xml.search('//abstracts-retrieval-response/coredata/title').text
    @issn = fix_issn(xml.search('//abstracts-retrieval-response/item/bibrecord/head/source/issn[@type="print"]').text) if xml.search('//abstracts-retrieval-response/item/bibrecord/head/source/issn[@type="print"]').text.present?
    @eissn = fix_issn(xml.search('//abstracts-retrieval-response/item/bibrecord/head/source/issn[@type="electronic"]').text) if xml.search('//abstracts-retrieval-response/item/bibrecord/head/source/issn[@type="electronic"]').text.present?
    @sourcetitle = xml.search('//abstracts-retrieval-response/coredata/publicationName').text
    @sourcevolume = xml.search('//abstracts-retrieval-response/coredata/volume').text
    @sourcepages =xml.search('//abstracts-retrieval-response/coredata/pageRange').text

    @extid = xml.search('//abstracts-retrieval-response/coredata/identifier').text

    @publication_links = [{url: DOI_URL_PREFIX + xml.search('//abstracts-retrieval-response/coredata/doi').text, position: 1}]

    # Parse publication_identifiers
    @publication_identifiers = []
    ## Parse DOI
    doi_value = xml.search('//abstracts-retrieval-response/coredata/doi').text
    if doi_value.present?
      @publication_identifiers << {
        identifier_value: doi_value,
        identifier_code: 'doi'
      }
    end

    ## Parse Scopus-ID
    scopus_value = xml.search('//abstracts-retrieval-response/coredata/identifier').text
    if scopus_value.present? && (scopus_value.include? ("SCOPUS_ID:"))
      scopus_value.slice! ("SCOPUS_ID:")
      @publication_identifiers << {
        identifier_value: scopus_value,
        identifier_code: 'scopus-id'
      }
    end
  end

  def self.find id
    headers = {"X-ELS-APIKey" => APIKEY, "X-ELS-ResourceVersion" => "XOCS", "Accept" => "application/xml"}
    response = RestClient.get "https://api.elsevier.com/content/abstract/doi/#{id}", headers
    item = self.new doi:id, xml: response
    item.datasource = 'scopus'
    item.sourceid = id
    return item
  end

  def self.find_by_id id
    self.find id
  rescue => error
    puts "Error in ScopusAdapter: #{error}"
    return nil  
  end

private

  # Some issn data is delivered with unwanted info and without hyphen char
  def fix_issn str
    return str if str.length == 9 && str[4] == '-'
    str.sub!("(ISSN)", "")
    str.strip!
    return str.insert(4, '-') if str.length == 8
    return str
  end

  def force_utf8(str)
    if !str.force_encoding("UTF-8").valid_encoding?
      str = str.force_encoding("ISO-8859-1").encode("UTF-8")
    end
    return str
  end
end

