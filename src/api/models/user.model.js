const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, minlength: 6, required: true },
    avatar_url: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('users', user);
