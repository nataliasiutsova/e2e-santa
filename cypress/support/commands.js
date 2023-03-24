const loginPage = require('../fixtures/pages/loginPage.json');
const generalElements = require('../fixtures/pages/general.json');
const boxPage = require('../fixtures/pages/boxPage.json');
const inviteeBoxPage = require('../fixtures/pages/inviteeBoxPage.json');
const invitePage = require('../fixtures/pages/invitePage.json');
const drawPage = require('../fixtures/pages/drawPage.json');

Cypress.Commands.add('loginUI', (userEmail, userPassword) => {
  cy.session([userEmail, userPassword], () => {
    cy.visit('/login');
    cy.get(loginPage.loginField).type(userEmail);
    cy.get(loginPage.passwordField).type(userPassword);
    cy.get(generalElements.submitButton).click({ force: true });
    cy.clearCookies();
  });
});

Cypress.Commands.add('newBox', (newBoxName, cashLimit, cashCurrency) => {
  cy.contains('Создать коробку').click({ force: true });
  cy.get(boxPage.boxNameField).type(newBoxName);
  cy.get(generalElements.arrowRight).click();
  cy.get(boxPage.sixthIcon).click();
  cy.get(generalElements.arrowRight).click();
  cy.get(boxPage.giftPriceToggle).check({ force: true });
  cy.get(boxPage.maxAnount).type(cashLimit);
  cy.get(boxPage.currency).select(cashCurrency);
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(generalElements.arrowRight).click();
});

Cypress.Commands.add('cardParticipantAutor', (wishes) => {
  cy.get(invitePage.createCardButton).click();
  cy.get(generalElements.arrowRight).click();
  cy.get(generalElements.arrowRight).click();
  cy.get(inviteeBoxPage.wishesInput).type(wishes);
  cy.get(generalElements.arrowRight).click();
});

Cypress.Commands.add('startDraw', () => {
  cy.contains('Перейти к жеребьевке').click({ force: true });
  cy.get(drawPage.submitButton).click({ force: true });
  cy.get(drawPage.confirmButton).click({ force: true });
});
