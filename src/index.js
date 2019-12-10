require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('port', process.env.PORT || 4000);

app.use(express.json());
app.use(require('cors')());

require('./api')(app);

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await app.listen(app.get('port'));
        console.log(`Server Running on Port ${app.get('port')}`);
    } catch (error) {
        console.error(error);
    }
})();
