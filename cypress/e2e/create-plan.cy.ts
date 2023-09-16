describe('Plan creation flow', () => {
  before('Setup', () => {
    cy.resetDbAndLogin();
    cy.visit('/app/home');
  });

  const planName = "Mr. Bob's Plan";

  it('Create blank plan', () => {
    // Open add plan dropdown
    cy.task('log', 'Opening custom plan modal...');
    cy.dataTestId('add-new-plan-btn').click();
    cy.dataTestId('add-custom-plan-btn').click();
    cy.dataTestId('add-transcript-plan-btn').click();

    // Modal should be visible
    cy.dataTestId('create-custom-plan-page').then(($el) => Cypress.dom.isVisible($el));

    // Fill out plan creation form
    cy.task('log', 'Filling out plan creation form...');
    cy.dataTestId('plan-name-input').type(planName);
    cy.dataTestId('major-autocomplete').type('Computer');
    cy.getDropdownOptions()
      .contains('Computer Science')
      .then(($el) => {
        cy.wrap($el.get(0).innerText).as('major');
        $el.click();
      });

    // Create plan without upload transcript
    cy.task('log', 'Creating plan...');
    cy.dataTestId('next-btn').click();
    cy.dataTestId('create-plan-btn').click();

    // Wait and verify redirect to plan
    cy.task('log', 'Verifying redirect...');
    cy.url({ timeout: 20000 }).should('include', '/app/plans/');

    // Check plan information
    cy.task('log', 'Verifying plan information');
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
