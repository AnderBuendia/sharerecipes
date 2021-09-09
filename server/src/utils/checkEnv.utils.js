const Env = require('../enums/env.enums');

/**
 * Checks if all environment variables are available in proccess.env before boot
 */
function checkEnv() {
  Object.keys(Env).forEach((keyEnv) => {
    if (!process.env[keyEnv])
      throw new Error(
        `${keyEnv} missing, check the .env.example file and verify that the .env file contains the same variables`
      );
  });
}

module.exports = { checkEnv };