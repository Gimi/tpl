class CreateProfiles < ActiveRecord::Migration
  def self.up
    create_table :profiles do |t|
      t.string :name, :null => false
      t.date :birthday
      t.string :education
      t.integer :work_experience

      t.string :state
      t.integer :profile_logs_count

      t.references :position

      t.timestamps
    end

    add_index :profiles, :position_id
  end

  def self.down
    drop_table :profiles
  end
end
