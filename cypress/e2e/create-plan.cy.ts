import { SeededUserData } from 'prisma/seedTestUser';

describe('Plan creation', () => {
  before('Setup', () => {
    cy.resetDbAndLogin();
    cy.visit('/app/home');
  });
});
