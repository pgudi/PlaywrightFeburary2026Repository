@Execute
Feature: Verify and validate Create Customer functionalities
  
  Scenario Outline: Verify Create Customer functioanlities
    When I navigate Application url
    Then I find the login page
    When I enter "<username>" in username text field
    When I enter "<password>" in password text field
    When I click on SignIn button
    Then I find the Home page
    When I click on Customer Menu
    When I click on Add Customer button
    When I enter "<customername>" in customer Name text field
    When I enter "<emailid>" in emailID text field
    When I enter "<location>" in location text field
    When I enter "<description>" in description text field
    When I click on save button
    Then I find newly created or modified "<customername>" in List Customer Page
    When I delete the newly created or modified "<customername>" from List Customer Page
    When I click on Logout option
    Then I find the login page

    Examples:
        | username | password | customername | emailid | location | description |
        | pgudi  | pgudi  | LVD College  | info@lvd.com | Raichur | College Project |