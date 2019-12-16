const mongoose = require('mongoose');

const validateUser = (field) => {
    if (field.length > 0) {
        for (let i = 0; i < field.length; i += 1) {
            if (typeof field[i] !== 'string') {
                return false;
            }
        }
        return true;
    }
    return false;
};

const validateMessage = (field) => {
    for (let i = 0; i < field.length; i += 1) {
        if (typeof field[i] !== 'object') {
            return false;
        }
    }
    return true;
};

const conversation = new mongoose.Schema({
    users: { type: Array, validate: validateUser },
    messages: { type: Array, validate: validateMessage },
    last_message: {},
}, {
    timestamps: true,
});

module.exports = mongoose.model('conversations', conversation);
