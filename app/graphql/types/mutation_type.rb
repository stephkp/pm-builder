module Types
  class MutationType < Types::BaseObject
    field :_empty, String, null: false, description: "Placeholder field"

    def _empty
      "ok"
    end
  end
end
