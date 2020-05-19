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
      cy.contains('header button#nav-user-menu', 'Test User');
    })

    it('Shows the My Lists button', () => {
      cy.get('header a#nav-my-lists')
        .should('have.attr', 'href', '/my/lists')
        .should('have.text', 'My Lists');
    })

    it("Links to the signed in user's profile", () => {
      cy.contains('header button#nav-user-menu', 'Test User').then($el => {
        cy.wrap($el).trigger('mouseenter', { force: true });
        cy.get('div[role=menu] #nav-profile').then($profileLink => {
          $profileLink.closest('div[role=menu]').show();
          cy.wrap($profileLink)
            .should('have.text', 'Profile')
            .should('have.attr', 'href', '/my/profile');
        });
      })
    })

    it("Shows the sign out button", () => {
      cy.contains('header button#nav-user-menu', 'Test User').then($el => {
        cy.wrap($el).trigger('mouseenter', { force: true });
        cy.get('div[role=menu] #nav-sign-out').then($signOutLink => {
          $signOutLink.closest('div[role=menu]').show();
          cy.wrap($signOutLink).contains('Sign Out')
        });
      })
    })
  })
})
