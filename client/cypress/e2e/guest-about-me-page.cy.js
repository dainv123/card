import { ABOUT_ME_IMAGE } from "../../constants/common";
import { CLIENT_URI } from "../../constants/endpoint";
import { ABOUT_ME, ABOUT_ME_CONTENT_1, ABOUT_ME_CONTENT_2, ABOUT_ME_CONTENT_3, ABOUT_ME_INTRO } from "../../constants/wording";

describe('[GUEST] About me page', () => {
  beforeEach(() => {
    cy.visit(CLIENT_URI)
    cy.contains('.header-main-menu li a', ABOUT_ME).click()
  })

  it('should load the about me title', () => {
    cy.get('.title-main-page')
      .should('exist')
      .within(() => {
        cy.contains('h4', ABOUT_ME).should('exist');
        cy.contains('p', ABOUT_ME_INTRO).should('exist');
      })
  });

  it('should load the about me intro', () => {
    cy.get('.section-content')
      .should('exist')
      .within(() => {
        cy.contains('.about-content', ABOUT_ME_CONTENT_1).should('exist');
        cy.contains('.about-content', ABOUT_ME_CONTENT_2).should('exist');
        cy.contains('.about-content', ABOUT_ME_CONTENT_3).should('exist');
      })
  });

    it('should load the about me background', () => {
      cy.get('.box-img .img-fluid')
        .should('have.attr', 'src')
        .and('include', ABOUT_ME_IMAGE)
        .and('not.be.empty');
  
      cy.get('.box-img .img-fluid').should('be.visible');
    });
});