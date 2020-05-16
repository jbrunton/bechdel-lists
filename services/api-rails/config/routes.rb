Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'home#index'
  get 'greet', to: 'home#greet'

  post 'auth/signin', to: 'auth#signin'
  post 'auth/signout', to: 'auth#signout'

  get 'lists', to: 'lists#index'
  get 'lists/browse', to: 'lists#browse'
  get 'lists/:list_id', to: 'lists#show'
  post 'lists', to: 'lists#create'
  delete 'lists/:list_id', to: 'lists#destroy'
end
