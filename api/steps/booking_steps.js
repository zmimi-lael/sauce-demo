const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

function buildGuestPayload() {
  const checkIn = faker.date.soon({ days: 10 });
  const checkOut = faker.date.soon({ days: 20, refDate: checkIn });

  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 500 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: checkIn.toISOString().slice(0, 10),
      checkout: checkOut.toISOString().slice(0, 10),
    },
    additionalneeds: faker.helpers.arrayElement(['Breakfast', 'Parking', 'Late checkout', 'None']),
  };
}

function assertBookingMatches(actual, expected) {
  expect(actual.firstname).toBe(expected.firstname);
  expect(actual.lastname).toBe(expected.lastname);
  expect(actual.totalprice).toBe(expected.totalprice);
  expect(actual.depositpaid).toBe(expected.depositpaid);
  expect(actual.bookingdates.checkin).toBe(expected.bookingdates.checkin);
  expect(actual.bookingdates.checkout).toBe(expected.bookingdates.checkout);
  expect(actual.additionalneeds).toBe(expected.additionalneeds);
}

Given('I create an authentication token', async function () {
  const response = await this.request.post('/auth', {
    data: {
      username: this.env.apiUsername,
      password: this.env.apiPassword,
    },
  });

  expect(response.status(), 'Auth should return 200').toBe(200);

  const body = await response.json();
  expect(body, 'Auth response should include a token').toHaveProperty('token');
  expect(typeof body.token, 'Token should be a string').toBe('string');
  expect(body.token.length, 'Token should not be empty').toBeGreaterThan(0);

  this.apiToken = body.token;
  this.apiResult = { status: response.status(), body };
});

When('I create a new booking with random guest data', async function () {
  const checkIn = faker.date.soon({ days: 10 });
  const checkOut = faker.date.soon({ days: 20, refDate: checkIn });

  this.bookingPayload = {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 500 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: checkIn.toISOString().slice(0, 10),
      checkout: checkOut.toISOString().slice(0, 10),
    },
    additionalneeds: faker.helpers.arrayElement(['Breakfast', 'Parking', 'Late checkout', 'None']),
    
  };

  console.log('Booking payload created:', this.bookingPayload);

  const response = await this.request.post('/booking', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: this.bookingPayload,
  });

  const body = await response.json().catch(() => null);

  this.apiResult = {
    status: response.status(),
    body,
    response,
  };

  if (body?.bookingid != null) {
    this.createdBookingId = body.bookingid;
  }
  console.log('Booking created with ID:', this.createdBookingId);
});

When('I retrieve the booking with id {string} using the token', async function (id) {
  expect(this.apiToken, 'Token must exist before retrieving a booking').toBeTruthy();

  const response = await this.request.get(`/booking/${id}`, {
    headers: {
      Accept: 'application/json',
      Cookie: `token=${this.apiToken}`,
    },
  });

  this.apiResult = {
    status: response.status(),
    body: await response.json().catch(() => null),
    response,
  };
  console.log('Booking retrieved:', this.apiResult.body);
});

When('I retrieve the created booking using the token', async function () {
  expect(this.apiToken, 'Token must exist before retrieving a booking').toBeTruthy();
  expect(this.createdBookingId, 'A booking must have been created first').toBeTruthy();

  const response = await this.request.get(`/booking/${this.createdBookingId}`, {
    headers: {
      Accept: 'application/json',
      Cookie: `token=${this.apiToken}`,
    },
  });

  this.apiResult = {
    status: response.status(),
    body: await response.json().catch(() => null),
    response,
  };
});

When('I update the created booking with new guest data', async function () {
  expect(this.apiToken, 'Token must exist before updating a booking').toBeTruthy();
  expect(this.createdBookingId, 'A booking must have been created first').toBeTruthy();

  this.updatedBookingPayload = buildGuestPayload();

  const response = await this.request.put(`/booking/${this.createdBookingId}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie: `token=${this.apiToken}`,
    },
    data: this.updatedBookingPayload,
  });

  this.apiResult = {
    status: response.status(),
    body: await response.json().catch(() => null),
    response,
  };
  console.log('Booking updated:', this.apiResult.body);
});

When('I delete the created booking using the token', async function () {
  expect(this.apiToken, 'Token must exist before deleting a booking').toBeTruthy();
  expect(this.createdBookingId, 'A booking must have been created first').toBeTruthy();

  const response = await this.request.delete(`/booking/${this.createdBookingId}`, {
    headers: {
      Cookie: `token=${this.apiToken}`,
    },
  });

  this.apiResult = {
    status: response.status(),
    body: await response.text().catch(() => null),
    response,
  };
  console.log('Booking status deleted:', this.apiResult.status);
});

When('I delete the created booking without a token', async function () {
  expect(this.createdBookingId, 'A booking must have been created first').toBeTruthy();

  // Intentionally remove the token
  const response = await this.request.delete(`/booking/${this.createdBookingId}`);

  this.apiResult = {
    status: response.status(),
    body: await response.text().catch(() => null),
    response,
  };
});

When('I update the created booking without a token', async function () {
  expect(this.createdBookingId, 'A booking must have been created first').toBeTruthy();

  this.updatedBookingPayload = buildGuestPayload();

  // Intentionally remove the token
  const response = await this.request.put(`/booking/${this.createdBookingId}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: this.updatedBookingPayload,
  });

  this.apiResult = {
    status: response.status(),
    body: await response.text().catch(() => null),
    response,
  };
});

Then('the API response status should be {int}', async function (expectedStatus) {
  expect(this.apiResult.status, `Expected status ${expectedStatus}`).toBe(expectedStatus);
});

Then('the API response body should contain the field {string}', async function (fieldName) {
  expect(this.apiResult.body, `Body should have field "${fieldName}"`).toHaveProperty(fieldName);
});

Then('the created booking should match the guest data I sent', async function () {
  expect(this.bookingPayload, 'Booking payload should exist').toBeTruthy();
  expect(this.apiResult.body, 'Response body should exist').toBeTruthy();

  const booking = this.apiResult.body.booking;
  expect(booking, 'Response should include a booking object').toBeTruthy();

  assertBookingMatches(booking, this.bookingPayload);
});

Then('the retrieved booking should match the guest data I sent', async function () {
  expect(this.bookingPayload, 'Booking payload should exist').toBeTruthy();
  expect(this.apiResult.body, 'Response body should exist').toBeTruthy();

  const booking = this.apiResult.body;
  
  assertBookingMatches(booking, this.bookingPayload);
});

Then('the updated booking should match the new guest data I sent', async function () {
  expect(this.updatedBookingPayload, 'Updated booking payload should exist').toBeTruthy();
  expect(this.apiResult.body, 'Response body should exist').toBeTruthy();
  // PUT returns the booking object directly (not wrapped in "booking")
  assertBookingMatches(this.apiResult.body, this.updatedBookingPayload);
});

Then('the retrieved booking should match the updated guest data', async function () {
  expect(this.updatedBookingPayload, 'Updated booking payload should exist').toBeTruthy();
  expect(this.apiResult.body, 'Response body should exist').toBeTruthy();
  assertBookingMatches(this.apiResult.body, this.updatedBookingPayload);
});