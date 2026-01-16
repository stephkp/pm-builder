module Types
  class DocumentType < Types::BaseObject
    field :id, ID, null: false
    field :document, String, null: true
    field :document_file_name, String, null: true
    field :document_content_type, String, null: true
    field :document_file_size, Integer, null: true
    field :document_updated_at, GraphQL::Types::ISO8601DateTime, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :investor_id, Integer, null: false
  end
end