@sanity
Feature: Verify and validate Login and Logout functionalities with params
  Background: fundamental Steps
    When I navigate Application url
    Then I find the login page
  Scenario: Verify Login and Logout functioanlities
    # When I navigate Application url
    # Then I find the login page
    When I enter "pgudi" in username text field
    When I enter "pgudi" in password text field
    When I click on SignIn button
    Then I find the Home page
    When I click on Logout option
    Then I find the login page

  Scenario: Verify Login and Logout functioanlities
    # When I navigate Application url
    # Then I find the login page
    When I enter "pgudi" in username text field
    When I enter "pgudi" in password text field
    When I click on SignIn button
    Then I find the Home page
    When I click on Logout option
    Then I find the login page

  Scenario: Verify Login and Logout functioanlities
    # When I navigate Application url
    # Then I find the login page
    When I enter "pgudi" in username text field
    When I enter "pgudi" in password text field
    When I click on SignIn button
    Then I find the Home page
    When I click on Logout option
    Then I find the login page