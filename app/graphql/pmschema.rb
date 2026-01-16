require 'graphql'

require_relative 'types/base_object'
require_relative 'types/investor_type'
require_relative 'types/query_type'
require_relative 'types/mutation_type'

class PmSchema < GraphQL::Schema
  query(Types::QueryType)
  mutation(Types::MutationType)
end