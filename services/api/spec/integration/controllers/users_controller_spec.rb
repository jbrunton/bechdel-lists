require 'rails_helper'
require 'db_helper'

RSpec.describe UsersController, type: :controller do
  let!(:public_list) { List.create(title: 'Public List', public: true) }
  let!(:private_list) { List.create(title: 'Private List', public: false) }

  let!(:public_user) { User.create(email: 'public.user@example.com', name: 'Public User', lists: [public_list]) }
  let!(:private_user) { User.create(email: 'private.user@example.com', name: 'Private User', lists: [private_list]) }

  let!(:user) { User.create(email: 'test.user@example.com', name: 'Test User') }

  describe "GET /users/profile" do
    it "returns the profile for authenticated users" do
      get :profile, session: { user_id: user.id }

      expect(response.status).to eq(200)
      expect(response.body).to eq(user.to_json)
    end

    it "returns a 401 if the user isn't authenticated" do
      get :profile
      expect(response.status).to eq(401)
    end
  end

  describe "PUT /users/profile" do
    context "if the user is authenticated" do
      let(:session) { { user_id: user.id } }

      context "given a valid name" do
        let(:new_name) { 'Test User Rockz' }
        let(:params) { { user: { name: new_name } } }

        it "updates the user" do
          put :update, session: session, params: params

          expect(response.status).to eq(200)
          expect(JSON.parse(response.body)).to eq(user.reload.as_json)
          expect(user.name).to eq(new_name)
        end
      end

      context "given an invalid name" do
        let(:invalid_name) { '' }
        let(:params) { { user: { name: invalid_name } } }

        it "returns a 422" do
          put :update, session: session, params: params
          expect(response.status).to eq(422)
          expect(response.body).to eq({
              "errors": {
                  "name": ["can't be blank"]
              },
              "messages": ["Name can't be blank"]
          }.to_json)
        end
      end
    end

    it "returns a 401 if the user isn't authenticated" do
      put :update
      expect(response.status).to eq(401)
    end
  end
  #
  # describe "GET/lists" do
  #   it "assigns all the authenticated user's lists" do
  #     get :index, session: { user_id: user.id }
  #     expect(assigns(:lists)).to eq([user_list])
  #   end
  # end
  #
  # describe "GET/lists/:list_id" do
  #   it "assigns the given list if the user is authorized" do
  #     get :show, params: { list_id: user_list.id }, session: { user_id: user.id }
  #     expect(assigns(:list)).to eq(user_list)
  #     expect(response.status).to eq(200)
  #   end
  #
  #   it "returns a 403 if the user is not authorized" do
  #     get :show, params: { list_id: private_list.id }, session: { user_id: user.id }
  #     expect(response.status).to eq(403)
  #   end
  # end
end
