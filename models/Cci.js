const mongoose = require('mongoose');

// name
// propriet

const cciSchema = new mongoose.Schema({
    username: String,
    password: String,
    address: String,
    phno: String,
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }],
    proprietor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    DCPU: String,
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }]
});

module.exports = mongoose.model('Cci', cciSchema);
