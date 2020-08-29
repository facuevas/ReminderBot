const mongoose = require('mongoose');

const reminderSchema = mongoose.Schema({
    setByUser: String,
    reminderMessage: String,
    reminderSetDate: Date,
    reminderCycle: String,
    nextTimeToSendReminder: Date
});

module.exports = reminderSchema;