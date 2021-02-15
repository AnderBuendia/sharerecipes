const User = require('../models/User');

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const uploadImage = require('../middleware/uploadImage');

router.post('/user', uploadImage, async (req, res) => {
    if (req.file) {
        const { filename } = req.file
        const image_url = `${process.env.HOST_FRONT}/images/${filename}`;
        const authorization = req.headers['authorization'];

        if(authorization) {
            try {
                const token = authorization.split(' ')[1];
                const payload = jwt.verify(token, process.env.SECRET_JWT_ACCESS);
                
                let user = await User.findById(payload.id);
                
                if (user.image_name) {
                    const pathName = path.join(__dirname, `../images/${user.image_name}`);
                    fs.unlinkSync(pathName);
                }

                user = await User.findOneAndUpdate(
                    { _id: user.id }, 
                    {
                        image_url,
                        image_name: filename
                    }, 
                    { new: true } 
                );
                
                return res.json({image_url, filename})
                
            } catch (error) {
                console.log(error)
            }
        }
    }

    res.send('Image upload file')
});

router.post('/recipes', uploadImage, async (req, res) => {
    if (req.file) {
        const { filename } = req.file;
        const image_url = `${process.env.HOST_FRONT}/images/${filename}`;
        const authorization = req.headers['authorization'];

        if(authorization) {
            try { 
                return res.json({image_url, filename})
            } catch (error) {
                console.log(error)
            }
        }
    }

    res.send('Image upload file')
});

module.exports = router;