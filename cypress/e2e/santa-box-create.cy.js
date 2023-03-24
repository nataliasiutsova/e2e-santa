const users = require('../fixtures/users.json');
const generalElements = require('../fixtures/pages/general.json');
const dashboardPage = require('../fixtures/pages/dashboardPage.json');
const invitePage = require('../fixtures/pages/invitePage.json');
const inviteeDashboardPage = require('../fixtures/pages/inviteeDashboardPage.json');
import { faker } from '@faker-js/faker';

describe('user can create a box and run it', () => {
  const newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let wishes =
    faker.word.adjective() + ' ' + faker.word.noun() + ' ' + faker.word.verb();
  let cashLimit = faker.datatype.number(500);
  let cashCurrency = 'Доллар';
  let keyBox;

  it('userAutor logins, creates a box', () => {
    cy.loginUI(users.userAutor.email, users.userAutor.password);
    cy.newBox(newBoxName, cashLimit, cashCurrency);

    cy.get(dashboardPage.createdBoxName).should('have.text', newBoxName);
    cy.get('.layout-1__header-wrapper-fixed .toggle-menu-item span')
      .invoke('text')
      .then((text) => {
        expect(text).to.include('Участники');
        expect(text).to.include('Моя карточка');
        expect(text).to.include('Подопечный');
      });
  });

  it('userAutor fills in a participant card', () => {
    cy.get(generalElements.submitButton).click();
    cy.cardParticipantAutor(wishes);
    cy.get(inviteeDashboardPage.cardParticipant)
      .should('exist')
      .and('contain.text', wishes)
      .and('contain.text', users.userAutor.name);
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke('text')
      .then((text) => {
        expect(text).to.contain('Это — анонимный чат с вашим Тайным Сантой');
      });
  });

  it('userAutor add a box  participants manually', () => {
    cy.contains(newBoxName).click({ force: true });
    cy.get(generalElements.submitButton).click();

    cy.get(invitePage.nameParticipant1Field).type(users.user1.name);
    cy.get(invitePage.emailParticipant1Field).type(users.user1.email);

    cy.get(invitePage.nameParticipant2Field).type(users.user2.name);
    cy.get(invitePage.emailParticipant2Field).type(users.user2.email);

    cy.get(invitePage.nameParticipant3Field).type(users.user3.name);
    cy.get(invitePage.emailParticipant3Field).type(users.user3.email);

    cy.get(invitePage.inviteButton).click();
    cy.get(invitePage.tip)
      .should('exist')
      .and(
        'contain.text',
        'Карточки участников успешно созданы и приглашения уже отправляются.'
      );
    cy.contains(newBoxName).click({ force: true });
    cy.get(dashboardPage.userCards).should('exist').and('have.length', 4);
  });

  it('Start a draw of participants', () => {
    cy.startDraw();
    cy.contains('Жеребьевка проведена').should('exist');
    cy.clearAllCookies();
  });

  it('User1 checks notification about draw', () => {
    cy.loginUI(users.user1.email, users.user1.password);
    cy.get(generalElements.notificationLink).click();
    cy.contains(
      `У тебя появился подопечный в коробке "${newBoxName}". Скорее переходи по кнопке, чтобы узнать кто это!`
    ).should('exist');
    cy.clearCookies();
  });

  it('User2 checks notification about draw', () => {
    cy.loginUI(users.user2.email, users.user2.password);
    cy.get(generalElements.notificationLink).click();
    cy.contains(
      `У тебя появился подопечный в коробке "${newBoxName}". Скорее переходи по кнопке, чтобы узнать кто это!`
    ).should('exist');
    cy.clearCookies();
  });

  it('User3 checks notification about draw', () => {
    cy.loginUI(users.user3.email, users.user3.password);
    cy.get(generalElements.notificationLink).click();
    cy.contains(
      `У тебя появился подопечный в коробке "${newBoxName}". Скорее переходи по кнопке, чтобы узнать кто это!`
    ).should('exist');
    cy.clearCookies();
  });

  after('delete box by API', () => {
    cy.request({
      method: 'POST',
      url: '/api/login',
      body: {
        email: users.userAutor.email,
        password: users.userAutor.password,
      },
    });
    cy.request({
      method: 'GET',
      url: '/api/account/boxes',
    }).then((res) => {
      let obj = res.body.find((item) => item.box.name == newBoxName);
      keyBox = obj.box.key;
      cy.request({
        method: 'DELETE',
        url: '/api/box/' + keyBox,
      });
    });
  });
});
