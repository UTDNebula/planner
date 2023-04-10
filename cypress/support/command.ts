// @ts-ignore
Cypress.Commands.add('dataTestId', (selector, opts) => {
  const testIdSelector = `[data-testid="${selector}"]`;
  return cy.get(testIdSelector, {});
});
