def setup_person_json_views
      ActiveRecord::Base.connection.execute <<-SQL
      DROP VIEW IF EXISTS v_people_v_identifiers CASCADE;
      CREATE OR REPLACE VIEW v_people_v_identifiers AS
      SELECT p.id AS person_id,
             json_agg(json_build_object(
              'code',
              CASE
                WHEN s.name = 'xkonto' THEN 'X_ACCOUNT'
                WHEN s.name = 'orcid' THEN 'ORCID'
                WHEN s.name = 'cid' THEN 'CID'
                WHEN s.name = 'scopus-auth-id' THEN 'SCOPUS_AUTHOR_ID'
                WHEN s.name = 'wos-researcher-id' THEN 'WOS_RESEARCHER_ID'
                ELSE 'OTHER'
              END,
             'value',
             i.value)) AS identifiers
        FROM people p
        LEFT JOIN identifiers i
          ON i.person_id = p.id
        JOIN sources s
          ON s.id = i.source_id
       GROUP BY p.id
      ;

      DROP VIEW IF EXISTS v_people_v_person_objects CASCADE;
      CREATE OR REPLACE VIEW v_people_v_person_objects AS
      SELECT p.id AS person_id,
             json_agg(json_build_object('gup_person_id', p.id, 'first_name', p.first_name, 'last_name', p.last_name, 'start_date', p.created_at, 'end_date', p.deleted_at)) AS person_object
      FROM people p
        --WHERE p.deleted_at IS NULL
        GROUP BY p.id
      ;

      DROP VIEW IF EXISTS v_people CASCADE;
      CREATE OR REPLACE VIEW v_people AS
      SELECT p.id AS person_id,
             p.deleted_at as deleted_at,
             json_build_object('names', po.person_object, 'year_of_birth', p.year_of_birth, 'identifiers', COALESCE(i.identifiers, '[]')) AS person
        FROM people p
        LEFT JOIN v_people_v_person_objects po
          ON p.id = po.person_id
        LEFT JOIN v_people_v_identifiers i
          ON p.id = i.person_id
        --WHERE p.deleted_at IS NULL
      ;
SQL
end

# This is necessary because this code is run during db:schema:load, but the
# tables needed for the view is not present at this point.
begin
  setup_person_json_views
rescue
end
