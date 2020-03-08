const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    name: String,
    age: String,
    guardian: { type: mongoose.Schema.Types.ObjectId, ref: 'Guardian' }
});

module.exports = mongoose.model('Child', childSchema);
