@Execute
Feature: Verify and validate Login and Logout functionalities with Multiple params

  Scenario Outline: Verify Login and Logout functioanlities with Multiple params
    When I navigate Application url
    Then I find the login page
    When I enter "<username>" in username text field
    When I enter "<password>" in password text field
    When I click on SignIn button
    Then I find the Home page
    When I click on Logout option
    Then I find the login page

    Examples:
        | username | password |
        | pgudi  | pgudi  | 
        | pgudi  | pgudi  | 
        | pgudi  | pgudi  | 