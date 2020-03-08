const mongoose = require('mongoose');
const { MONGOURI } = require('./config');

module.exports = async () => {
    try {
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('connected to db');
    } catch (err) {
        console.log('cannot connect to db');
        process.exit(1);
    }
};
