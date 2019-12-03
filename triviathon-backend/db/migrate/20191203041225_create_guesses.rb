class CreateGuesses < ActiveRecord::Migration[6.0]
  def change
    create_table :guesses do |t|
      t.integer :user_id
      t.integer :guestion_id
      t.string :content

      t.timestamps
    end
  end
end
