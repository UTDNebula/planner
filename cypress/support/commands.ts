import { SeededUserData } from 'prisma/seedTestUser';

// Utility to select by data-testid
// Usage: cy.dataTestId("some-id", opts) -> cy.get([data-testid=some-id], opts)
// @ts-ignore
Cypress.Commands.add('dataTestId', (selector, opts) => {
  const testIdSelector = `[data-testid="${selector}"]`;
  return cy.get(testIdSelector, opts);
});

// Resets and seeds db and sets next-auth session cookie
Cypress.Commands.add('resetDbAndLogin', () => {
  cy.task<SeededUserData>('reset:db').then(({ session }) => {
    cy.setCookie(Cypress.env('SESSION_COOKIE_NAME'), session.sessionToken, {
      domain: 'localhost',
      // session is not actually a 'Date' object here, it's a string
      expiry: Math.floor(new Date(session.expires).getTime() / 1000),
      httpOnly: true,
      path: '/',
      secure: false,
    });
  });
});
