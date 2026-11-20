def setup_project_json_views
      ActiveRecord::Base.connection.execute <<-SQL
      DROP VIEW IF EXISTS v_projects CASCADE;
      CREATE OR REPLACE VIEW v_projects AS
      SELECT pr.id AS project_id,
        json_agg(json_build_object(
          'project_id', pr.id,
          'title', pr.title,
          'abbrev', pr.abbrev,
          'project_number', pr.project_number,
          'description', pr.description,
          'keywords', pr.keywords,
          'url', pr.url,
          'start_year', pr.start_year,
          'end_year', pr.end_year
        )) AS project
        FROM projects pr
        GROUP BY pr.id
      ;

--       DROP VIEW IF EXISTS v_people_v_person_objects CASCADE;
--       CREATE OR REPLACE VIEW v_people_v_person_objects AS
--       SELECT p.id AS person_id,
--              json_agg(json_build_object('gup_person_id', p.id, 'first_name', p.first_name, 'last_name', p.last_name, 'start_date', p.created_at, 'end_date', p.deleted_at)) AS person_object
--       FROM people p
--         --WHERE p.deleted_at IS NULL
--         GROUP BY p.id
--       ;
-- 
-- 
--       DROP VIEW IF EXISTS v_people CASCADE;
--       CREATE OR REPLACE VIEW v_people AS
--       SELECT p.id AS person_id,
--              p.deleted_at as deleted_at,
--              json_build_object('names', po.person_object, 'year_of_birth', p.year_of_birth, 'identifiers', COALESCE(i.identifiers, '[]')) AS person
--         FROM people p
--         LEFT JOIN v_people_v_person_objects po
--           ON p.id = po.person_id
--         LEFT JOIN v_people_v_identifiers i
--           ON p.id = i.person_id
--         --WHERE p.deleted_at IS NULL
--       ;
-- 
-- 
-- --      DROP VIEW IF EXISTS v_projects_v_project_objects CASCADE;
-- --      CREATE OR REPLACE VIEW v_projects_v_project_objects AS
-- --      SELECT pr.id AS project_id,
-- --             json_agg(json_build_object('project_id', pr.id, 'title', pr.title, 'abbrev', pr.abbrev, 'project_number', pr.project_number, 'description', pr.description, 'keywords', pr.keywords, 'url', pr.url, 'start_year', pr.start_year, 'end_year', pr.end_year, 'listplace', pr2p.project_listplace)) AS project_object
-- --      FROM projects pr
-- --        JOIN projects2publications pr2p ON pr2p.project_id = pr.id
-- --        --WHERE p.deleted_at IS NULL
-- --        GROUP BY pr.id
-- --      ;
-- --
-- --      DROP VIEW IF EXISTS v_projects CASCADE;
-- --      CREATE OR REPLACE VIEW v_projects AS
-- --      SELECT pr.id AS project_id,
-- --             -- p.deleted_at as deleted_at,
-- --             json_build_object('project_id', pr.id, 'title', pr.title, 'abbrev', pr.abbrev, 'project_number', pr.project_number, 'description', pr.description, 'keywords', pr.keywords, 'url', pr.url, 'start_year', pr.start_year, 'end_year', pr.end_year, 'listplace', po.project_listplace) AS project
-- --        FROM projects pr
-- --        LEFT JOIN v_projects_v_project_objects po
-- --          ON pr.id = po.project_id
-- --        --WHERE p.deleted_at IS NULL
-- --      ;
SQL
end

# This is necessary because this code is run during db:schema:load, but the
# tables needed for the view is not present at this point.
begin
  setup_project_json_views
rescue
end
