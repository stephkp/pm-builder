module Types
  class InvestorType < Types::BaseObject
    field :id, ID, null: false
    field :first_name, String, null: true
    field :last_name, String, null: true
    field :date_of_birth, GraphQL::Types::ISO8601Date, null: true
    field :phone_number, String, null: true
    field :street_address, String, null: true
    field :city, String, null: true
    field :state, String, null: true
    field :zip_code, String, null: true
    field :ssn, String, null: true
    field :documents_attached, Boolean, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def documents_attached
      object.documents.attached?
    end
  end
end