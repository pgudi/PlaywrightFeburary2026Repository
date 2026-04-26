Feature: Display All Available Customers

    Scenario: Display all customers using GET HTTP Method functionality
        Given I execute authenticate Post Http Method
        Given I capture the authenticate response
        When I store the token in a variable
        Then I find the 200 status code
        Given I execute display all customers Get Http Method
        When I store the all customer response in a variable
        Then I find the 200 status code

