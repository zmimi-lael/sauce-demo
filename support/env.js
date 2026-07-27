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
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
  };
}

module.exports = { loadEnvironment };