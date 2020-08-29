const mongoose = require('mongoose');

const reminderSchema = mongoose.Schema({
    setByUser: String,
    reminderMessage: String,
    reminderSetDate: Date,
    reminderDayCycle: Number,
    nextTimeToSendReminder: Date
});

module.exports = reminderSchema;