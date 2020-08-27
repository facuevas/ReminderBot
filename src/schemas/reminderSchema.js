const mongoose = require('mongoose');

const reminderSchema = mongoose.Schema({
    setByUser: String,
    reminderMessage: String,
    reminderSetDate: Date,
    reminderCycle: Number
});

module.exports = reminderSchema;