/// <reference types="cypress" />

context('Profile', () => {
  // beforeEach(() => {
  //   cy.visit('https://example.cypress.io/commands/actions')
  // })

  it('Requires auth', () => {
    cy.visit('http://localhost:3001/my/profile');
    cy.get('.v-banner').should('contain', 'You need to sign in to view this page');
  })

  it("shows the signed in user's name", () => {
    cy.signin();
    
    cy.visit('http://localhost:3001/my/profile');
    
    cy.contains('.v-list-item', 'Test User');
    cy.contains('.v-list-item', 'test.user@example.com');
  })
})
