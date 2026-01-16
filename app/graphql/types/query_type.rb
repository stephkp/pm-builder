module Types
  class QueryType < Types::BaseObject
    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :investors, [Types::InvestorType], null: false, description: "Returns a list of all investors"
    def investors
      Investor.all
    end

    field :investor, Types::InvestorType, null: true do
      description "Find an investor by ID"
      argument :id, ID, required: true
    end
    def investor(id:)
      Investor.find_by(id: id)
    end
  end
end