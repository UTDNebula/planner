describe('Create plan, then', () => {
  beforeEach(() => {
    cy.task('teardown:db');
    cy.task('seed:db');
  });

  it('Log in with Google', () => {
    cy.visit('/');
  });
});
