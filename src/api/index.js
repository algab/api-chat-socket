const user = require('./modules/user');

module.exports = (app) => {
    app.use('/users', user);
};
