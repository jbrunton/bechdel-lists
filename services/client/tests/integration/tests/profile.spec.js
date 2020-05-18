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
    cy.request('POST', 'http://localhost:3001/api/dev/signin', { email: 'test.user@example.com' })
    cy.visit('http://localhost:3001/my/profile');
  
    //cy.get('main').debug();
    cy.get('main').should('contain', 'Test User');
  })
})
