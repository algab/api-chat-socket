const conversation = require('./modules/conversation');
const user = require('./modules/user');

module.exports = (app) => {
    app.use('/conversations', conversation);
    app.use('/users', user);
};
