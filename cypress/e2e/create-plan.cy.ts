describe('Plan creation flow', () => {
  beforeEach('Setup', () => {
    cy.resetDbAndLogin();
    cy.visit('/app/home');
  });

  const planName = "Mr. Bob's Plan";

  it('Create blank plan', () => {
    // Open add plan dropdown
    cy.task('log', 'Opening blank plan modal...');
    cy.dataTestId('add-new-plan-btn').click();
    cy.dataTestId('add-blank-plan-btn').click();

    // Modal should be visible
    cy.dataTestId('create-blank-plan-page').then(($el) => Cypress.dom.isVisible($el));

    // Fill out plan creation form
    cy.task('log', 'Filling out plan creation form...');
    cy.dataTestId('plan-name-input').type(planName);
    cy.dataTestId('major-autocomplete').type('Computer');
    cy.contains('Computer Science')
      .should('exist')
      .click()
      .then(() => {
        cy.get('[data-testid=major-autocomplete]').invoke('text').as('major');
      });

    // Create plan without upload transcript
    cy.task('log', 'Creating plan...');
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

  it('Create custom plan', () => {
    // Open add plan dropdown
    cy.task('log', 'Opening custom plan modal...');
    cy.dataTestId('add-new-plan-btn').click();
    cy.dataTestId('add-custom-plan-btn').click();

    // Modal should be visible
    cy.dataTestId('create-custom-plan-page').then(($el) => Cypress.dom.isVisible($el));

    // Fill out plan creation form
    cy.task('log', 'Filling out plan creation form...');
    cy.dataTestId('plan-name-input').type(planName);
    cy.dataTestId('major-autocomplete').type('Computer');
    cy.contains('Computer Science')
      .should('exist')
      .click()
      .then(() => {
        cy.get('[data-testid=major-autocomplete]').invoke('text').as('major');
      });

    // Create plan with uploading transcript
    cy.task('log', 'Creating plan...');
    cy.dataTestId('next-btn').click();
    cy.dataTestId('upload-transcript-btn').click();

    cy.get('input[type=file]').selectFile('cypress/data/dummytranscript.pdf', { force: true });
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

  it('Create template plan', () => {
    // Open add plan dropdown
    cy.task('log', 'Opening template plan modal...');
    cy.dataTestId('add-new-plan-btn').click();
    cy.dataTestId('add-template-plan-btn').click();

    // Modal should be visible
    cy.dataTestId('create-template-plan-page').then(($el) => Cypress.dom.isVisible($el));

    // Fill out plan creation form
    cy.task('log', 'Filling out plan creation form...');
    cy.dataTestId('plan-name-input').type(planName);
    cy.dataTestId('major-autocomplete').type('Computer');
    cy.contains('Computer Science')
      .should('exist')
      .click()
      .then(() => {
        cy.get('[data-testid=major-autocomplete]').invoke('text').as('major');
      });

    // Create template plan without upload transcript
    cy.task('log', 'Creating plan...');
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

    cy.get('#tutorial-editor-1 svg.animate-spin').should('not.exist', { timeout: 10000 });
    cy.get('#tutorial-editor-1')
      .contains('It seems like a screw has gone loose!', { timeout: 0 })
      .should('not.exist');
  });
});
