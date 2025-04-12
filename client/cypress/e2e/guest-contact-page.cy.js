import { CLIENT_URI, SERVER_URI } from "../../constants/endpoint";
import { CONTACT, CONTACT_INTRO, SEND_CONTACT_SUCCESSFULLY } from "../../constants/wording";

describe('[GUEST] Contact page', () => {
  beforeEach(() => {
    cy.visit(CLIENT_URI)
    cy.contains('.header-main-menu li a', CONTACT).click()
  })

  it('should load the contact title', () => {
    cy.get('.title-main-page')
      .should('exist')
      .within(() => {
        cy.contains('h4', CONTACT).should('exist');
        cy.contains('p', CONTACT_INTRO).should('exist');
      })
  });

  it('should fill the contact form and send email', () => {
    cy.intercept('POST', SERVER_URI + '/graphql', (req) => {
      if (req.body.operationName === 'SendContact') {
        req.reply({
          statusCode: 200,
          body: {
            data: {},
          },
        });
      }
    }).as('mockSendContact');
    

    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('textarea[name="comment"]').type('Hello, this is a test message.');  
    cy.get('input[type="submit"]').click();
    cy.get('.ant-message')
      .contains(SEND_CONTACT_SUCCESSFULLY)
      .should('be.visible');
  });
});