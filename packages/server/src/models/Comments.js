const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
    message: {
        type: String
    },
    votes: {
        type: Number,
        default: 0
    },
    voted: {
        type: Array,
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipes',
        default: null
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Comments', commentsSchema);