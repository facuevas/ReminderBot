const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReminderSchema = new Schema({
    setByUser: String,
    reminderMessage: String,
    reminderSetDate: Date,
    reminderDayCycle: Number,
    nextTimeToSendReminder: Date
});

module.exports = mongoose.model('ReminderSchema', ReminderSchema);