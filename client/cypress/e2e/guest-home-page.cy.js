import { AVATAR_URI } from "../../constants/common";
import { CLIENT_URI } from "../../constants/endpoint";
import { ABOUT_ME, BLOG, CONTACT, CONTACT_ME, HOME, LOG_IN, THEME } from "../../constants/wording";

describe('[GUEST] Home page', () => {
  beforeEach(() => {
    cy.visit(CLIENT_URI)
    
  })

  it('should load the my name', () => {
    cy.get('.title-block h2')
      .should('exist')
      .and('not.be.empty');

    cy.get('.site-title')
      .should('exist')
      .and('not.be.empty');
  });

  it('should load the my avatar', () => {
    cy.get('img[alt="avatar"]')
      .should('have.attr', 'src')
      .and('include', AVATAR_URI)
      .and('not.be.empty');

    cy.get('img[alt="avatar"]').should('be.visible');
  });

  it('should load the menu', () => {
    cy.get('.header-main-menu')
      .should('exist')
      .within(() => {
        cy.contains('li', HOME).should('exist');
        cy.contains('li', ABOUT_ME).should('exist');
        cy.contains('li', THEME).should('exist');
        cy.contains('li', BLOG).should('exist');
        cy.contains('li', CONTACT).should('exist');
      })
  });

  it('should load the actions', () => {
    cy.get('.home-buttons')
      .should('exist')
      .within(() => {
        cy.contains('a.bt-submit', LOG_IN).should('exist');
        cy.contains('a.bt-submit', CONTACT_ME).should('exist');
      })
  });
});