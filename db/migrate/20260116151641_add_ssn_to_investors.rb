class AddSsnToInvestors < ActiveRecord::Migration[7.1]
  def change
    add_column :investors, :ssn, :string
  end
end
