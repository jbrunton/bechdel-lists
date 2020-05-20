require 'rails_helper'

RSpec.describe User, type: :model do
  describe ".find_or_create_by_email" do
    context "if the user doesn't exist" do
      it "creates a new user with the given name and email" do
        user = User.find_or_create_by_email('test.user@example.com', 'Test User')

        expect(user.email).to eq('test.user@example.com')
        expect(user.name).to eq('Test User')
      end
    end

    context "if the user exists" do
      let!(:user) { User.create(email: 'test.user@example.com', name: 'Display Name' )}

      it "finds the existing user" do
        found_user = User.find_or_create_by_email('test.user@example.com', 'Test User')
        expect(found_user).to eq(user)
      end

      it "keeps the existing name" do
        found_user = User.find_or_create_by_email('test.user@example.com', 'Test User')
        expect(found_user.name).to eq('Display Name')
      end
    end
  end
end
