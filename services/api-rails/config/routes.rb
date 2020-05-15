Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'home#index'
  get 'greet', to: 'home#greet'

  post 'auth/signin', to: 'auth#signin'
  post 'auth/signout', to: 'auth#signout'

  get 'lists/browse', to: 'lists#browse'
end
