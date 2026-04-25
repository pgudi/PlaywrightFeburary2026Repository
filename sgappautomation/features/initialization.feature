Feature: Launch and Navigate Application URL

  Scenario: Launch Chromium Browser and Navigate Application URL
    When I navigate Application url
    Then I find the login page
    Then I close application