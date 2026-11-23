def setup_serie_json_views
      ActiveRecord::Base.connection.execute <<-SQL
      DROP VIEW IF EXISTS v_series CASCADE;
      CREATE OR REPLACE VIEW v_series AS
      SELECT s.id AS serie_id,
        json_agg(json_build_object(
          'serie_id', s.id,
          'title', s.title,
          'issn', s.issn,
          'start_year', s.start_year,
          'end_year', s.end_year
        )) AS serie
        FROM series s
        GROUP BY s.id
      ;

SQL
end

# This is necessary because this code is run during db:schema:load, but the
# tables needed for the view is not present at this point.
begin
  setup_serie_json_views
rescue
end
