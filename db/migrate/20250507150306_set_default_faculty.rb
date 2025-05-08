class SetDefaultFaculty < ActiveRecord::Migration
  def change
    Department.where(faculty_id: nil).each do |department|
      department.faculty_id = 665 # Default faculty id
      department.save
    end
  end
end
