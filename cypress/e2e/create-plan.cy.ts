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
    cy.getDropdownOptions()
      .contains('Computer Science')
      .then(($el) => {
        cy.wrap($el.get(0).innerText).as('major');
        $el.click();
      });

    // Create plan without upload transcript
    cy.log('Creating plan...');
    cy.dataTestId('next-btn').click();
    cy.dataTestId('create-plan-btn').click();

    // Wait and verify redirect to plan
    cy.wait(10000);
    cy.url().should('include', '/app/plans/');

    // Check plan information
    cy.log('Verifying plan information');
    cy.get('@major').then((majorAlias) => {
      // Check plan title
      cy.dataTestId('plan-title')
        .then(($el) => $el.text())
        .should('eq', planName);

      // Check plan major
      const major = `${majorAlias}`; // Whack workaround
      cy.dataTestId('plan-major')
        .then(($el) => $el.text())
        .should('eq', major);
    });
  });
});
