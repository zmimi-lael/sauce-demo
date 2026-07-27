Feature: API Booking Sample for Restful-Booker and fetching an existing booking

  @booking @api
  Scenario: Create a token and retrieve an existing booking by id
    Given I create an authentication token
    When I retrieve the booking with id "1" using the token
    Then the API response status should be 200
    And the API response body should contain the field "firstname"
    And the API response body should contain the field "firstname"
    And the API response body should contain the field "lastname"
    And the API response body should contain the field "totalprice"
    And the API response body should contain the field "bookingdates"

  @booking @api
  Scenario: Create a new booking
    Given I create an authentication token
    When I create a new booking with random guest data
    Then the API response status should be 200
    And the API response body should contain the field "bookingid"
    And the API response body should contain the field "booking"
    And the created booking should match the guest data I sent

  @booking @api
  Scenario: Create a booking and retrieve it by id
    Given I create an authentication token
    When I create a new booking with random guest data
    And I retrieve the created booking using the token
    Then the API response status should be 200
    And the API response body should contain the field "firstname"
    And the API response body should contain the field "lastname"
    And the retrieved booking should match the guest data I sent

  @booking @api
  Scenario: Create a booking and update it
    Given I create an authentication token
    When I create a new booking with random guest data
    And I update the created booking with new guest data
    Then the API response status should be 200
    And the updated booking should match the new guest data I sent
    When I retrieve the created booking using the token
    Then the API response status should be 200
    And the retrieved booking should match the updated guest data

  @booking @api
  Scenario: Create a booking and delete it
    Given I create an authentication token
    When I create a new booking with random guest data
    And I delete the created booking using the token
    Then the API response status should be 201
    When I retrieve the created booking using the token
    Then the API response status should be 404
# --- Negative Scenarios ---

  @booking @api @negative
  Scenario: Retrieve a booking with an invalid id
    Given I create an authentication token
    When I retrieve the booking with id "99999999" using the token
    Then the API response status should be 404

  @booking @api @negative
  Scenario: Delete a booking without a token
    Given I create an authentication token
    When I create a new booking with random guest data
    And I delete the created booking without a token
    Then the API response status should be 403

  @booking @api @negative
  Scenario: Update a booking without a token
    Given I create an authentication token
    When I create a new booking with random guest data
    And I update the created booking without a token
    Then the API response status should be 403
