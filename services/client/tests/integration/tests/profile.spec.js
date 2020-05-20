/// <reference types="cypress" />

context('Profile', () => {
  it('Requires auth', () => {
    cy.visit('/my/profile');
    cy.contains('.v-banner', 'You need to sign in to view this page');
  })

  it("shows the signed in user's name", () => {
    cy.signin('test.user@example.com', 'Test User');
    
    cy.visit('/my/profile');
    
    cy.get('[data-cy=user_name]').should('have.value', 'Test User');
    cy.get('[data-cy=email]').should('have.value', 'test.user@example.com');
  })
})
