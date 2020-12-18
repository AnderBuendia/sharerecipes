const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    image_url: {
        type: String,
    },
    image_name: {
        type: String,
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "Member"
    },
    refreshTokens: [
        {
            hash: {
                type: String,
            },
            expiry: {
                type: Date,
            },
        },
    ],
}, {
    timestamps: true
});

module.exports = mongoose.model('Users', usersSchema);