import { CLIENT_URI } from "../../constants/endpoint";
import { THEME, THEME_INTRO } from "../../constants/wording";

describe('[GUEST] Theme page', () => {
  beforeEach(() => {
    cy.visit(CLIENT_URI)
    cy.contains('.header-main-menu li a', THEME).click()
  })

  it('should load the theme title', () => {
    cy.get('.title-main-page')
      .should('exist')
      .within(() => {
        cy.contains('h4', THEME).should('exist');
        cy.contains('p', THEME_INTRO).should('exist');
      })
  });
});