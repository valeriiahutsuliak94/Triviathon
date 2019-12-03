class CreateAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :answers do |t|
      t.string :question
      t.boolean :correct
      t.integer :user_id

      t.timestamps
    end
  end
end
