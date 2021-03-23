/**
 * Username validation
 * - Only contains alphanumeric characters, underscore and dot
 * - Underscore and dot can't be at the end or start of a username (e.g _username / username_ / .username / username.)
 * - Underscore and dot can't be next to each other (e.g user_.name)
 * - Underscore or dot can't be used multiple times in a row (e.g user__name / user..name)
 * - Number of characters must be between 3 to 20
 * @param value Value to validate
 * @returns Is valid
 */
const usernameValidation = (value) => {
  const userName = value.trim();
  const regex = /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

  if (!userName.match(regex)) return false;

  return true;
};

/**
 * Email validation
 * @param value Value to validate
 * @returns Is valid
 */
const emailValidation = (value) => {
  console.log(value);
  const email = value.trim();
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email.length < 6) return false;
  if (!email.match(regex)) return false;

  return true;
};

/**
 * Password validation
 *
 * - Minimum length 6 characters
 * - Character range (ASCII) x21 to x7E
 * @param value Value to validate
 * @returns Is valid
 */
const passwordValidation = (value) => {
  const pass = value.trim();
  const regex = /^[\x21-\x7E]+$/;

  if (pass.length < 7) return false;
  if (!pass.match(regex)) return false;

  return true;
};

module.exports = {
  usernameValidation,
  emailValidation,
  passwordValidation,
};
