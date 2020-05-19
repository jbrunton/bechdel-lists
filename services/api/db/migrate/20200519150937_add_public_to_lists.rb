class AddPublicToLists < ActiveRecord::Migration[6.0]
  def change
    add_column :lists, :public, :boolean, default: false
  end
end
