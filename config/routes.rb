Rails.application.routes.draw do
  apipie
  resources :users
  resources :session

  namespace :v1, :defaults => {:format => :json} do
    get "fetch_import_data" => "publications#fetch_import_data"

    put "publications/publish/:id" => "publications#publish"
    get "publications/review/:id" => "publications#review"
    get "publications/bibl_review/:id" => "publications#bibl_review"
    get "publications/set_biblreview_postponed_until/:id" => "publications#set_biblreview_postponed_until"

    get "publications/feedback_email/:publication_id" => "publications#feedback_email"

    resources :publications, param: :id
    resources :drafts
    post "drafts_admin" => "drafts#create_admin"
    resources :published_publications
    get "published_publications_xls" => "published_publications#xls"
    put "published_publications_admin/:id" => "published_publications#update_admin"
    resources :review_publications
    resources :biblreview_publications
    resources :publication_types
    resources :postpone_dates
    resources :faculties
    resources :people
    resources :sources
    resources :data_sources
    resources :series
    resources :projects
    get "departments/get_next_id" => "departments#get_next_id"
    resources :departments
    resources :categories
    resources :languages
    resources :publication_identifier_codes
    resources :userdata, param: :xkonto
    resources :messages, param: :message_type
    resources :reports, param: :name
    resources :feedback_mails
    resources :imports
    resources :asset_data
    resources :publication_records
    resources :person_gup_admin_records
    resources :person_records
    resources :endnote_files
    resources :artwork_types

    get "affiliations" => "affiliations#affiliations_for_actor"
    get "journals" => "journals#search"
    get "public_publication_lists" => "published_publications#index_public"
    put "organisations" => "organisations#update_batch"
  end

  get "oai" => "oai/oai#index"
  get "rss" => "rss/rss#index"

  get "json/publications/list" =>  "v1/published_publications#index_public"
  post "file" => "v1/asset_data#create"
  get "file/:id" => "v1/asset_data#show"
  put "file" => "v1/asset_data#update"
  delete "file/:id" => "v1/asset_data#destroy"
end

