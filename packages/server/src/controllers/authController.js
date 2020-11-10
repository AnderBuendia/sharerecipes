const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
require('dotenv').config({path: 'config/variables.env'});

exports.authenticateUser = async (req, res, next) => {
    /* Check errors */
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    /* Verify if user has an account */
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401).json({ msg: 'User is wrong or not exists'});

        /* Stops the execution of the code */
        return next();
    }

    /* Verify pass and auth user */
    if (bcrypt.compareSync(password, user.password)) {
        /* Create JWT */
        const token = jwt.sign({
            id: user._id,
            email: user.email,
            name: user.name
        }, process.env.SECRET_JWT, {
            expiresIn: '8h'
        });

        res.json({token});
    } else {
        res.status(401).json({ msg: 'Wrong Password' });
        return next();
    }
};

exports.userAuthenticated = async (req, res) => {
    // console.log(req.user);
    res.json({user: req.user});
};