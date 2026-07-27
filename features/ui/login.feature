Feature: Login functionality
  As a user of SauceDemo
  I want to be able to log in
  So that I can access the inventory

  Background:
    Given I am on the login page

  Scenario: Successful login with valid credentials
    When I login with valid credentials
    Then I should be redirected to the inventory page
    And the inventory should contain products

  Scenario: Failed login with invalid credentials
    When I login with username "invalid_user" and password "wrong_password"
    Then I should see an error message containing "Username and password do not match"