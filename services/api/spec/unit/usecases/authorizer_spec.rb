require 'rails_helper'
require 'null_db_helper'

RSpec.describe Authorizer do
  describe "when given a list" do
    let(:public_list) { List.create(title: 'Public List', public: true) }
    let(:private_list) { List.create(title: 'Private List', public: false) }

    describe "for authenticated users" do
      let(:user) { User.create(email: 'test.user@example.com') }
      let(:owned_list) { user.lists.create(title: 'Test List', public: false) }
      let(:authorizer) { Authorizer.new(user) }

      it "authorizes read and write actions on the authenticated user's list" do
        expect(authorizer.can? :read, owned_list).to eq(true)
        expect(authorizer.can? :write, owned_list).to eq(true)
      end

      it "authorizes read on other public lists" do
        expect(authorizer.can? :read, public_list).to eq(true)
      end

      it "disallows write on other public lists" do
        expect(authorizer.can? :write, public_list).to eq(false)
      end

      it "disallows all actions on other private lists" do
        expect(authorizer.can? :read, private_list).to eq(false)
        expect(authorizer.can? :write, private_list).to eq(false)
      end
    end

    describe "for unauthenticated users" do
      let(:authorizer) { Authorizer.new(nil) }

      it "authorizes read actions public lists" do
        expect(authorizer.can? :read, public_list).to eq(true)
      end

      it "disallows write on public lists" do
        expect(authorizer.can? :write, public_list).to eq(false)
      end

      it "disallows all actions on private lists" do
        expect(authorizer.can? :read, private_list).to eq(false)
        expect(authorizer.can? :write, private_list).to eq(false)
      end
    end
  end

  describe "it validates arguments" do
    let(:authorizer) { Authorizer.new(nil) }
    let(:list) { List.create(title: 'Test List') }

    it "errors for invalid actions" do
      expect { authorizer.can?(:party, list) }.to raise_error("Unexpected action: party")
    end

    it "errors for invalid subjects" do
      expect { authorizer.can?(:read, User.new) }.to raise_error("Unexpected type: User")
    end
  end
end
