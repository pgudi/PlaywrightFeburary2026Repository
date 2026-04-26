Feature: Create Customer Functionality

    Scenario: Create New Customer using Post HTTP Method functionality
        Given I execute authenticate Post Http Method
        Given I capture the authenticate response
        When I store the token in a variable
        Then I find the 200 status code
        Given I execute Create Customer Post Http Method
        When I store the create customer response in a variable
        When I store customer id in a variable
        Then I find the 201 status code
        Given I execute Display Customer Get Http Method
        When I store the display customer response in a variable
        Then I find the 200 status code
        Given I execute Delete Customer Delete Http Method
        When I store the delete customer response in a variable
        Then I find the 200 status code
