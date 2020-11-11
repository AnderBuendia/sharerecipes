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
        default: null
    },
    image_name: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: "Member"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Users', usersSchema);