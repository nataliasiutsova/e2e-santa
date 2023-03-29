import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { After } from '@badeball/cypress-cucumber-preprocessor';
import { faker } from '@faker-js/faker';
const loginPage = require('../../fixtures/pages/loginPage.json');
const generalElements = require('../../fixtures/pages/general.json');
const boxPage = require('../../fixtures/pages/boxPage.json');
const dashboardPage = require('../../fixtures/pages/dashboardPage.json');
const inviteeBoxPage = require('../../fixtures/pages/inviteeBoxPage.json');
const inviteeDashboardPage = require('../../fixtures/pages/inviteeDashboardPage.json');
const drawPage = require('../../fixtures/pages/drawPage.json');

const invitePage = require('../../fixtures/pages/invitePage.json');
const users = require('../../fixtures/users.json');

let wishes =
  faker.word.adjective() + ' ' + faker.word.noun() + ' ' + faker.word.verb();

const newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
const keyBox = faker.word.noun({ length: { min: 5, max: 10 } });
let cashLimit = faker.datatype.number(500);
let cashCurrency = 'Доллар';

Given('I log in as {string} and {string}', (string, string2) => {
  cy.visit('/login');
  cy.get(loginPage.loginField).type(string);
  cy.get(loginPage.passwordField).type(string2);
  cy.get(generalElements.submitButton).click({ force: true });
});

When('I click Create box button', () => {
  cy.get('.home-page-buttons > [href="/box/new"] > .btn-main').click();
});

When('I fill out the box form', () => {
  cy.get(boxPage.boxNameField).type(newBoxName);
  cy.get(boxPage.boxKeyField).clear().type(keyBox);
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(boxPage.sixthIcon).click();
  cy.get(generalElements.arrowRight).click();
  cy.get(boxPage.giftPriceToggle).check({ force: true });
  cy.get(boxPage.maxAnount).type(cashLimit);
  cy.get(boxPage.currency).select(cashCurrency);
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(generalElements.arrowRight).click({ force: true });
});

Then('I must see the box name on the screen', () => {
  cy.get(dashboardPage.createdBoxName).should('have.text', newBoxName);
});

Then('The box page must contain text', (table) => {
  cy.get('.layout-1__header-wrapper-fixed .toggle-menu-item span')
    .invoke('text')
    .then((text) => {
      expect(text).to.include(table.raw()[0]);
      expect(text).to.include(table.raw()[1]);
      expect(text).to.include(table.raw()[2]);
    });
});

Given('I am on the box page', () => {
  cy.visit('/box/' + keyBox);
});

When('I click Add participants button', () => {
  cy.get(generalElements.submitButton).click({ multiple: true });
});

When('I click Create the participant card button', () => {
  cy.get(invitePage.createCardButton).click({ multiple: true });
});

When('I fill out the participant form', () => {
  cy.get(generalElements.arrowRight).click({ multiple: true });
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(inviteeBoxPage.wishesInput).type(wishes);
  cy.get(generalElements.arrowRight).click({ force: true });
});

Then('I must see the participant card on the screen', () => {
  cy.get(inviteeDashboardPage.cardParticipant)
    .should('exist')
    .and('contain.text', wishes)
    .and('contain.text', users.userAutor.name);
});

Then('The participant card page must contain notice', (table) => {
  cy.get(inviteeDashboardPage.noticeForInvitee)
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(table.raw());
    });
});

When('I enter name and email of the participants', () => {
  cy.get(invitePage.nameParticipant1Field).type(users.user1.name);
  cy.get(invitePage.emailParticipant1Field).type(users.user1.email);

  cy.get(invitePage.nameParticipant2Field).type(users.user2.name);
  cy.get(invitePage.emailParticipant2Field).type(users.user2.email);

  cy.get(invitePage.nameParticipant3Field).type(users.user3.name);
  cy.get(invitePage.emailParticipant3Field).type(users.user3.email);
});

When('I click Invite participants button', () => {
  cy.get(invitePage.inviteButton).click();
});

Then('I must see the message on the screen', (table) => {
  cy.get(invitePage.tip).should('exist').and('contain.text', table.raw());
});

When('I click Back to box button', () => {
  cy.get('.btn-secondary').click({ force: true });
});

When('I click Go to the draw link', () => {
  cy.contains('Перейти к жеребьевке').click({ force: true });
});

When('I click Start the draw button', () => {
  cy.get(drawPage.submitButton).click({ force: true });
  cy.get(drawPage.confirmButton).click({ force: true });
});

Then('I must see on the screen', (table) => {
  cy.get('.picture-notice')
    .invoke('text')
    .then((text) => {
      expect(text).to.include(table.raw());
    });
});

Given('User logs in as {string} and {string}', (email, password) => {
  cy.visit('/login');
  cy.get(loginPage.loginField).type(email);
  cy.get(loginPage.passwordField).type(password);
  cy.get(generalElements.submitButton).click({ force: true });
});

When('User clicks Notification link in the header', () => {
  cy.get(generalElements.notificationLink).click();
});

Then('User must see the notification of the completed draw', () => {
  cy.contains(
    `У тебя появился подопечный в коробке "${newBoxName}". Скорее переходи по кнопке, чтобы узнать кто это!`
  ).should('exist');
});

After({ tags: '@draw' }, () => {
  cy.request({
    method: 'POST',
    url: '/api/login',
    body: {
      email: users.userAutor.email,
      password: users.userAutor.password,
    },
  });
  cy.request({
    method: 'DELETE',
    url: '/api/box/' + keyBox,
  });
});
