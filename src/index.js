require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const server = require('http').Server(app);
const socket = require('socket.io')(server);

app.set('port', process.env.PORT || 4000);

app.use(express.json());
app.use(require('cors')());

app.use((req, res, next) => {
    req.socket = socket;
    next();
});

require('./api')(app);
require('./socket')(socket);

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await server.listen(app.get('port'));
        console.log(`Server Running on Port ${app.get('port')}`);
    } catch (error) {
        console.error(error);
    }
})();
