const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: String,
    age: String,
    qualification: String,
    address: String,
    designation: String,
    workingAt: String
});

module.exports = mongoose.model('Employee', employeeSchema);
