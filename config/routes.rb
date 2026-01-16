Rails.application.routes.draw do
  root 'pages#index'

  # Health check route
  get 'up' => 'health#index'

  resources :investors, only: [:index, :new, :create, :show, :edit, :update] do
    get 'success', on: :collection
    member do
      get 'download/:document_id', to: 'investors#download', as: 'download'
    end
  end
end
