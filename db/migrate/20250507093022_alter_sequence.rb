class AlterSequence < ActiveRecord::Migration
  def change
    # Drop the sequence faculties_id_seq used by table faculties and use the departments_id_seq instead
    execute <<-SQL
      ALTER TABLE faculties ALTER COLUMN id SET DEFAULT nextval('departments_id_seq');
      DROP SEQUENCE IF EXISTS faculties_id_seq;
    SQL
  end
end
