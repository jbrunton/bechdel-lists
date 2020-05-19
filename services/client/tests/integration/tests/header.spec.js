/// <reference types="cypress" />

context('Header', () => {
  context('when not signed in', () => {
    beforeEach(() => {
      cy.visit('/');
    })
      
    it('Shows a sign in button', () => {
      cy.contains('header button', 'Sign In');
    })

    it('Shows the Browse button', () => {
      cy.get('header a#nav-browse')
        .should('have.attr', 'href', '/browse/lists')
        .should('have.text', 'Browse')
    })
  })

  context('when signed in', () => {
    beforeEach(() => {
      cy.signin();
      cy.visit('/');
    })

    it('Shows the signed in user', () => {
      cy.contains('[data-cy=nav-user-menu]', 'Test User');
    })

    it('Shows the My Lists button', () => {
      cy.get('header a#nav-my-lists')
        .should('have.attr', 'href', '/my/lists')
        .should('have.text', 'My Lists');
    })

    it("Links to the signed in user's profile", () => {
      cy.contains('[data-cy=nav-user-menu]', 'Test User').then($el => {
        cy.wrap($el).trigger('mouseenter', { force: true });
        cy.get('div[role=menu] [data-cy=nav-profile]').then($profileLink => {
          $profileLink.closest('div[role=menu]').show();
          cy.wrap($profileLink)
            .get('[data-cy=nav-profile]')
            .should('have.text', 'Profile')
            .should('have.attr', 'href', '/my/profile');
        });
      })
    })

    it("Shows the sign out button", () => {
      cy.contains('[data-cy=nav-user-menu]', 'Test User').then($el => {
        cy.wrap($el).trigger('mouseenter', { force: true });
        cy.get('div[role=menu] [data-cy=nav-user-menu-options]').then($menuOptions => {
          $menuOptions.closest('div[role=menu]').show();
          cy.wrap($menuOptions).get('[data-cy=nav-sign-out]').contains('Sign Out');
        });
      })
    })
  })
})
