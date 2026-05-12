require "net/http"
require "json"
require "uri"
require "cgi"

class Unpaywall < ActiveRecord::Base
  def self.extract_doi(raw_url)
    return nil if raw_url.blank?

    s = CGI.unescapeHTML(raw_url.to_s.dup)

    2.times do
      decoded = CGI.unescape(s)
      break if decoded == s

      s = decoded
    end

    match = s.match(%r{(10\.\d+/[^\s\?#&<>"']+)}i)
    return nil unless match

    doi = match[1]
    doi = doi.sub(/[)\].,;:]+\z/, "")

    doi.presence
  end

  def self.oa_status_for_url(url, email:)
    doi = extract_doi(url)
    return "unknown" if doi.blank?

    oa_status_for_doi(doi, email: email)
  end

  def self.oa_status_for_doi(doi, email:)
    encoded_doi = URI.encode_www_form_component(doi)
    uri = URI("https://api.unpaywall.org/v2/#{encoded_doi}")
    uri.query = URI.encode_www_form(email: email)

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.open_timeout = 15
    http.read_timeout = 15

    req = Net::HTTP::Get.new(uri.request_uri)
    req["Accept"] = "application/json"

    res = http.request(req)

    return "unknown" if res.code.to_i == 404
    return "error" unless res.is_a?(Net::HTTPSuccess)

    body = JSON.parse(res.body)
    body["is_oa"] == true
  rescue StandardError => e
    Rails.logger.warn(
      "Unpaywall lookup failed for DOI #{doi.inspect}: #{e.class}: #{e.message}"
    )
    "error"
  end

  def self.check_oa_status(publication)

    links = publication.current_version.publication_links

    email = ENV["UNPAYWALL_EMAIL"]
    links.each do |link|
        puts "Checking OA-status for =#{link.url}"
        next if link.is_oa == true
        oa_status = Unpaywall.oa_status_for_url(link.url, email: email)
        next if oa_status == "error"
        now = Time.current

        case oa_status
        when true
          link.update_columns(is_oa: true, checked_at: now)
        when false
          link.update_columns(is_oa: false, checked_at: now)
        when "unknown"
          link.update_columns(checked_at: now)
        end
    end
    end

end