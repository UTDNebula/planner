describe('Plan creation flow', () => {
  before('Setup', () => {
    cy.resetDbAndLogin();
    cy.visit('/app/home');
  });

  const planName = "Mr. Bob's Plan";

  it('Create blank plan', () => {
    // Open add plan dropdown
    cy.log('Opening custom plan modal');
    cy.dataTestId('add-new-plan-btn').click();
    cy.dataTestId('add-custom-plan-btn').click();

    // Modal should be visible
    cy.dataTestId('create-custom-plan-page').then(($el) => Cypress.dom.isVisible($el));

    // Fill out plan creation form
    cy.log('Filling out plan creation form');
    cy.dataTestId('plan-name-input').type(planName);
    cy.dataTestId('major-autocomplete').type('Computer');
    cy.getDropdownOptions().contains('Computer Science').click();

    // Create plan without upload transcript
    cy.log('Creating plan...');
    cy.dataTestId('next-btn').click();
    cy.dataTestId('create-plan-btn').click();

    cy.wait(10000);
    cy.url().should('include', '/app/plans/');

    cy.log('Verifying plan information');
    cy.dataTestId('plan-title')
      .then(($el) => $el.text())
      .should('eq', planName);
  });
});
