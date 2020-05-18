/// <reference types="cypress" />

context('Profile', () => {
  it('Requires auth', () => {
    cy.visit('/my/profile');
    cy.contains('.v-banner', 'You need to sign in to view this page');
  })

  it("shows the signed in user's name", () => {
    cy.signin();
    
    cy.visit('/my/profile');
    
    cy.contains('.v-list-item', 'Test User');
    cy.contains('.v-list-item', 'test.user@example.com');
  })
})
