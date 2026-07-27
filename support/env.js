const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

/**
 * Loads environment variables based on ENV=qa|stg
 * Defaults to STG if nothing is provided.
 */
function loadEnvironment() {
  const envName = (process.env.ENV || 'stg').toLowerCase();
  const envFile = path.resolve(__dirname, `../environments/${envName}.env`);

  if (!fs.existsSync(envFile)) {
    throw new Error(`Environment file not found: ${envFile}`);
  }

  dotenv.config({ path: envFile });

  // Also load root .env if present (optional overrides)
  dotenv.config({ path: path.resolve(__dirname, '../.env'), override: false });

  return {
    name: envName,
    baseURL: process.env.BASE_URL,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    apiBaseURL: process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com',
    apiUsername: process.env.API_USERNAME || 'admin',
    apiPassword: process.env.API_PASSWORD || 'password123',
  };
}

module.exports = { loadEnvironment };