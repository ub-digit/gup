class ChangeReportView < ActiveRecord::Migration
  def up
    execute <<-SQL
CREATE OR REPLACE VIEW report_views AS
SELECT p.id AS publication_id,
       pv.id AS publication_version_id,
       pv.pubyear AS year,
       pv.publication_type AS publication_type,
       pv.content_type AS content_type,
       d.faculty_id AS faculty_id,
       d.id AS department_id,
       p2p.person_id AS person_id
FROM publications p
INNER JOIN publication_versions pv
  ON pv.id = p.current_version_id
INNER JOIN people2publications p2p
  ON p2p.publication_version_id = pv.id
INNER JOIN departments2people2publications d2p2p
  ON d2p2p.people2publication_id = p2p.id
INNER JOIN departments d
  ON d.id = d2p2p.department_id
WHERE p.deleted_at IS NULL
  AND p.published_at IS NOT NULL
SQL
  end
  
  def down
    execute <<-SQL
CREATE OR REPLACE VIEW report_views AS
SELECT p.id AS publication_id,
       pv.id AS publication_version_id,
       pv.pubyear AS year,
       pv.publication_type AS publication_type,
       pv.content_type AS content_type,
       d.faculty_id AS faculty_id,
       d.id AS department_id,
       p2p.person_id AS person_id
FROM publications p
INNER JOIN publication_versions pv
  ON pv.id = p.current_version_id
INNER JOIN people2publications p2p
  ON p2p.publication_version_id = pv.id
INNER JOIN departments2people2publications d2p2p
  ON d2p2p.people2publication_id = p2p.id
INNER JOIN departments d
  ON d.id = d2p2p.department_id
WHERE p.deleted_at IS NULL
SQL
  end
end
