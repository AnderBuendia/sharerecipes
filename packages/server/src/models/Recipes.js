const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        default: undefined
    },
    prep_time: {
        type: Number,
        trim: true
    },
    serves: {
        type: Number,
        trim: true
    },
    difficulty: {
        type: String,
        default: "MEDIUM"
    },
    image_url: {
        type: String,
    },
    image_name: {
        type: String,
    },
    description: {
        type: String
    },
    style: {
        type: String,
        default: "NONE"
    },
    comments: {
        type: Array,
    },
    votes: {
        type: Number,
        default: 0
    },
    voted: {
        type: Array,
    },
    average_vote: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Recipes', recipesSchema);