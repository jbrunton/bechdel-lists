require 'rails_helper'
require 'db_helper'

RSpec.describe ListsController, type: :controller do
  let!(:user) { User.create(email: 'test.user@example.com') }
  let!(:other_user) { User.create(email: 'other.user@example.com') }
  let!(:public_list) { other_user.lists.create(title: 'Public List', public: true) }
  let!(:private_list) { other_user.lists.create(title: 'Private List', public: false) }
  let!(:user_list) { user.lists.create(title: 'My List', public: false) }

  describe "GET /lists/browse" do
    it "assigns all public lists" do
      get :browse
      expect(assigns(:lists)).to eq([public_list])
    end
  end

  describe "GET/lists" do
    it "assigns all the authenticated user's lists" do
      get :index, session: { user_id: user.id }
      expect(assigns(:lists)).to eq([user_list])
    end
  end

  describe "GET/lists/:list_id" do
    it "assigns the given list if the user is authorized" do
      get :show, params: { list_id: user_list.id }, session: { user_id: user.id }
      expect(assigns(:list)).to eq(user_list)
      expect(response.status).to eq(200)
    end

    it "returns a 403 if the user is not authorized" do
      get :show, params: { list_id: private_list.id }, session: { user_id: user.id }
      expect(response.status).to eq(403)
    end
  end
end
