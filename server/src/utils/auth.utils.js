const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'src/variables.env' });

const createAccessToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.SECRET_JWT_ACCESS, {
    expiresIn: '12h',
  });
};

module.exports = { createAccessToken };
