Feature: Checkout
  As a logged-in customer
  I want to complete a purchase
  So that I can receive the products I selected

  Background:
    Given I am on the login page
    And I login with valid credentials
    And I should be redirected to the inventory page

  Scenario: Complete checkout with a product - E2E
    When I add the product "Sauce Labs Backpack" to the cart
    And I open the shopping cart
    And I proceed to checkout
    And I fill the checkout information with random customer data
    And I continue to the overview
    And I finish the order
    Then I should see the order confirmation
    And the confirmation message should contain "Thank you for your order"