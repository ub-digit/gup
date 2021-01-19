class AddArticleNumberToEndnoteRecord < ActiveRecord::Migration
  def change
    add_column :endnote_records, :article_number, :text
  end
end
