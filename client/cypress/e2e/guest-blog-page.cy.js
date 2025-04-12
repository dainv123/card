import { CLIENT_URI } from "../../constants/endpoint";
import { BLOG, BLOG_INTRO } from "../../constants/wording";

describe('[GUEST] Blog page', () => {
  beforeEach(() => {
    cy.visit(CLIENT_URI)
    cy.contains('.header-main-menu li a', BLOG).click()
  })

  it('should load the blog title', () => {
    cy.get('.title-main-page')
      .should('exist')
      .within(() => {
        cy.contains('h4', BLOG).should('exist');
        cy.contains('p', BLOG_INTRO).should('exist');
      })
  });
});