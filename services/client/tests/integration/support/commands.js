// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('signin', (email, name) => {
  cy.request('POST', '/api/dev/signin', {
    email: email || 'test.user@example.com',
    name: name || 'Test User'
  })
});

Cypress.Commands.add('showUserMenu', () => {
  cy.get('[data-cy=nav-user-menu]').then($el => {
    cy.wrap($el).trigger('mouseenter', { force: true });
    cy.get('div[role=menu] [data-cy=nav-profile]').then($profileLink => {
      $profileLink.closest('div[role=menu]').show();
    });
  });
})