Rails.application.routes.draw do
  # Root route - Homepage
  root 'pages#index'
  
  # Health check route
  get 'up' => 'health#index'
  
  # GraphQL endpoints
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  
  post "/graphql", to: "graphql#execute"
  
  # Investor resources
  get '/investors', to: 'pages#index'
  get '/investors/new', to: 'pages#index', as: :new_investor
  get '/investors/:id/edit', to: 'pages#index', as: :edit_investor

  resources :investors, only: [:create, :show, :update, :destroy] do
    get 'success', on: :collection
    member do
      get 'download/:document_id', to: 'investors#download', as: 'download'
    end
  end

  # Handle client-side routing for frontend frameworks
  get '*path', to: 'pages#index', constraints: ->(req) do
    !req.xhr? && req.format.html?
  end
end