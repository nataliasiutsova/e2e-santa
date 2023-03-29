
Feature: Drawing of the box participants
    
    As a authorized user, 
    I want to create box, add the participants
    In order to start the draw 
    All participants must receive a notification after a succesful draw

    @newBox
    Scenario: User creates a new box
    Given I log in as "test-email2023new@mail.ru" and "qwerty"
    When I click Create box button 
    And  I fill out the box form
    Then I must see the box name on the screen
    And  The box page must contain text
    |Участники    |
    |Моя карточка |
    |Подопечный   |

    @card
    Scenario: User fills out a participant card
    When I click Add participants button
    And I click Create the participant card button
    And I fill out the participant form
    Then I must see the participant card on the screen
    And The participant card page must contain notice 
    |Это — анонимный чат с вашим Тайным Сантой |
   
     
    @participants
    Scenario: User adds the box participants
    Given I am on the box page
      When I click Add participants button
      And I enter name and email of the participants
      And I click Invite participants button
      Then I must see the message on the screen
      |Карточки участников успешно созданы и приглашения уже отправляются.| 

  @draw
  Scenario: User starts the draw
  When I click Back to box button
  When I click Go to the draw link
  And I click Start the draw button
  Then I must see on the screen
  | Жеребьевка проведена|

@notification
Scenario Outline: Users check notification after draw
Given User logs in as "<email>" and "<password>"
    When User clicks Notification link in the header
    Then User must see the notification of the draw
    Examples:
        | email                       | password  |
        | test-email2023new+1@mail.ru | qwerty    |
        | test-email2023new+2@mail.ru | qwerty    |
        | test-email2023new+3@mail.ru | qwerty    |