const express = require('express');
const app = express();
const connectDB = require('./connectDB');

app.use(express.json());
connectDB();
const PORT = process.env.PORT || 3000;

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/cci', require('./routes/cci'));

app.listen(PORT, function() {
    console.log('server started');
});
