/// <reference types="cypress" />

context('Header', () => {
  beforeEach(() => {
    cy.visit('/');
  })
  
  context('when not signed in', () => {
    it('Shows a sign in button', () => {
      cy.contains('header button', 'Sign In');
    })  
  })

  // it("shows the signed in user's name", () => {
  //   cy.signin();
    
  //   cy.visit('/my/profile');
    
  //   cy.contains('.v-list-item', 'Test User');
  //   cy.contains('.v-list-item', 'test.user@example.com');
  // })
})
