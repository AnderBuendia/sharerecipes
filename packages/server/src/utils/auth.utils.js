const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'src/variables.env' });

const createAccessToken = user => {
    return jwt.sign({ id: user.id }, process.env.SECRET_JWT_ACCESS, { expiresIn: '12h' });
}

module.exports = { createAccessToken };