def setup_publication_json_views
      ActiveRecord::Base.connection.execute <<-SQL
      DROP VIEW IF EXISTS v_publications_v_publication_identifiers CASCADE;
      CREATE OR REPLACE VIEW v_publications_v_publication_identifiers AS
      SELECT pub.id AS publication_id,
             json_agg(json_build_object('identifier_code', pi.identifier_code, 'identifier_value', pi.identifier_value)) AS identifiers
        FROM publications pub
        JOIN publication_versions pv
          ON pub.current_version_id = pv.id
        JOIN publication_identifiers pi
          ON pv.id = pi.publication_version_id
       GROUP BY pub.id
      ;
      
      DROP VIEW IF EXISTS v_publications_v_people_identifiers CASCADE;
      CREATE OR REPLACE VIEW v_publications_v_people_identifiers AS
      SELECT p.id AS person_id,
             json_agg(json_build_object('type', s.name, 'value', i.value)) AS identifiers
        FROM people p
        JOIN identifiers i
          ON p.id = i.person_id
        JOIN sources s
          ON i.source_id = s.id
        GROUP BY p.id
      ;
      
      DROP VIEW IF EXISTS v_publications_v_people CASCADE;
      CREATE OR REPLACE VIEW v_publications_v_people AS
      SELECT p.id AS person_id,
             json_agg(json_build_object('id', p.id, 'first_name', p.first_name, 'last_name', p.last_name, 'year_of_birth', p.year_of_birth, 'identifiers', COALESCE(i.identifiers, '[]'))) AS person
        FROM people p
        LEFT JOIN v_publications_v_people_identifiers i
          ON p.id = i.person_id
        GROUP BY p.id
      ;
      
      DROP VIEW IF EXISTS v_publications_v_positions CASCADE;
      CREATE OR REPLACE VIEW v_publications_v_positions AS
      SELECT pub.id AS publication_id,
            p2p.person_id AS person_id,
            json_agg(json_build_object('position', p2p.position)) AS position
        FROM publications pub
        JOIN publication_versions pv
          ON pub.current_version_id = pv.id
        JOIN people2publications p2p
          ON pv.id = p2p.publication_version_id
      GROUP BY pub.id, p2p.person_id
      ;

      DROP VIEW IF EXISTS v_publications_v_affiliations CASCADE;
      CREATE OR REPLACE VIEW v_publications_v_affiliations AS
      SELECT pub.id AS publication_id,
             p2p.person_id AS person_id,
             json_agg(json_build_object('department_id', d.id, 'name_sv', d.name_sv, 'name_en', d.name_en, 'faculty_id', f.id, 'faculty_name_sv', f.name_sv, 'faculty_name_en', f.name_en)) AS affiliations
        FROM publications pub
        JOIN publication_versions pv
          ON pub.current_version_id = pv.id
        JOIN people2publications p2p
          ON pv.id = p2p.publication_version_id
        JOIN departments2people2publications d2p2p
          ON p2p.id = d2p2p.people2publication_id
        JOIN departments d
          ON d2p2p.department_id = d.id
        JOIN faculties f
          ON d.faculty_id = f.id
       GROUP BY pub.id, p2p.person_id
      ;
      
      DROP VIEW IF EXISTS v_publications_v_authors CASCADE;
      CREATE OR REPLACE VIEW v_publications_v_authors AS
      SELECT pub.id AS publication_id,
             json_agg(json_build_object(
                'person', p.person,
                'position', pos.position,
                'affiliations', a.affiliations
              )) AS authors
        FROM publications pub
        JOIN publication_versions pv
          ON pub.current_version_id = pv.id
        JOIN v_publications_v_affiliations a
          ON pub.id = a.publication_id
        JOIN v_publications_v_people p
          ON a.person_id = p.person_id
        JOIN v_publications_v_positions pos
          ON pub.id = pos.publication_id AND pos.person_id = p.person_id
      GROUP BY pub.id
      ;

      DROP VIEW IF EXISTS v_publications_v_publication_categories CASCADE;
      CREATE OR REPLACE VIEW v_publications_v_publication_categories AS
      SELECT pub.id AS publication_id,
             json_agg(json_build_object('category_id', c.id, 'svep_id', c.svepid, 'name_sv', c.name_sv, 'name_en', c.name_en)) AS categories
        FROM publications pub
        JOIN publication_versions pv
          ON pub.current_version_id = pv.id
        JOIN categories2publications c2p
          ON c2p.publication_version_id = pv.id
        JOIN categories c
          ON c.id = c2p.category_id
       WHERE c.category_type = 'HSV_11'
    GROUP BY pub.id
      ;
      
      DROP VIEW IF EXISTS v_publications_v_series CASCADE;
      CREATE OR REPLACE VIEW v_publications_v_series AS
      SELECT pub.id AS publication_id,
              json_agg(json_build_object('series_id', s.id, 'title', s.title, 'issn', s.issn, 'listplace', s2p.serie_listplace, 'part', s2p.serie_part)) AS series
        FROM publications pub
        JOIN publication_versions pv
          ON pub.current_version_id = pv.id
        JOIN series2publications s2p
          ON s2p.publication_version_id = pv.id
        JOIN series s
          ON s.id = s2p.serie_id
        GROUP BY pub.id
      ;

      DROP VIEW IF EXISTS v_publications CASCADE;
      CREATE OR REPLACE VIEW v_publications AS
      SELECT pub.id AS publication_id,
             json_build_object(
               'id', 'gup_' || pub.id,
               'publication_id', pub.id,
               'current_version_id', pub.current_version_id,
               'published_at', pub.published_at,
               'deleted_at', pub.deleted_at,
               'created_at', pub.created_at,
               'updated_at', pub.updated_at,
               'epub_ahead_of_print', pub.epub_ahead_of_print,
               'title', pv.title,
               'alt_title', pv.alt_title,
               'abstract', pv.abstract,
               'pubyear', pv.pubyear::text,
               'publanguage', pv.publanguage,
               'url', pv.url,
               'keywords', pv.keywords,
               'journal_id', pv.journal_id,
               'sourcetitle', pv.sourcetitle,
               'sourcevolume', pv.sourcevolume,
               'sourceissue', pv.sourceissue,
               'sourcepages', pv.sourcepages,
               'issn', pv.issn,
               'eissn', pv.eissn,
               'article_number', pv.article_number,
               'extent', pv.extent,
               'publisher', pv.publisher,
               'place', pv.place,
               'isbn', pv.isbn,
               'made_public_in', pv.made_public_in,
               'artistic_basis', pv.artistic_basis,
               'publication_type_id', pv.publication_type_id,
               'publication_type_code', pt.code,
               'publication_type_label', pt.label_sv,
               'ref_value', pv.ref_value,
               'version_created_at', pv.created_at,
               'version_created_by', pv.created_by,
               'version_updated_at', pv.updated_at,
               'version_updated_by', pv.updated_by,
               'publication_identifiers', COALESCE(pi.identifiers, '[]'),
               'authors', a.authors,
               'categories', COALESCE(pc.categories, '[]'),
               'series', COALESCE(s.series, '[]'),
               'source', 'gup',
               'attended', true
             ) AS publication
        FROM publications pub
        JOIN publication_versions pv
          ON pub.current_version_id = pv.id
        JOIN publication_types pt
          ON pv.publication_type_id = pt.id
        LEFT JOIN v_publications_v_authors a
          ON pub.id = a.publication_id
        LEFT JOIN v_publications_v_publication_identifiers pi
          ON pub.id = pi.publication_id
        LEFT JOIN v_publications_v_publication_categories pc
          ON pub.id = pc.publication_id
        LEFT JOIN v_publications_v_series s
          ON pub.id = s.publication_id
        WHERE pub.deleted_at IS NULL
        AND pub.published_at IS NOT NULL
      ;
            
SQL
end

# This is necessary because this code is run during db:schema:load, but the
# tables needed for the view is not present at this point.
begin
  setup_publication_json_views
rescue
end
