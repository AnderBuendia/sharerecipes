const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newUser = async (req, res) => {
    // console.log(req.body);
    
    /* Show errors */
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    /* Check if user was registered */
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
        return res.status(400).json({ msg: 'User is already registered'})
    }

    /* Create new user */
    user = new User(req.body);

    /* Hash password */
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    /* Save user in DB */
    try {
        await user.save();
        res.json({ msg: 'User was successfully created' });
    } catch (error) {
        console.log(error);
    }

}

exports.getUser = async (req, res) => {
    console.log(req.body);
}