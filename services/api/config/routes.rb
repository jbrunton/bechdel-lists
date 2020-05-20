Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'home#index'
  get 'greet', to: 'home#greet'

  post 'auth/signin', to: 'auth#signin'
  post 'auth/signout', to: 'auth#signout'
  get 'auth/authorize/:type/:id', to: 'auth#authorize'

  get 'users/profile', to: 'users#profile'
  put 'users/profile', to: 'users#update'
  
  get 'lists', to: 'lists#index'
  get 'lists/browse', to: 'lists#browse'
  get 'lists/:list_id', to: 'lists#show'
  post 'lists', to: 'lists#create'
  put 'lists/:list_id', to: 'lists#update'
  delete 'lists/:list_id', to: 'lists#destroy'
  post 'lists/:list_id/movies/:imdb_id', to: 'lists#add'
  delete 'lists/:list_id/movies/:imdb_id', to: 'lists#remove'

  get 'lists/:list_id/charts/by_year', to: 'charts#by_year'

  get 'genres', to: 'genres#index'
  get 'lists/:list_id/genres', to: 'genres#list_genres'

  get 'search', to: 'search#index'

  unless Rails.env.production?
    post 'dev/signin', to: 'dev#signin'
  end
end
