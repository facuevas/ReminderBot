const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReminderSchema = new Schema({
    channelId: String, // the ID of the channel where the reminder will be displayed to
    message: String, // Our reminder message
    dayOccurance: Number, // Number of days in between each reminder
    setDate: Date, // The first date the reminder was set
    nextReminderDate: Date // The next time the reminder will be sent
});

module.exports = mongoose.model('ReminderSchema', ReminderSchema);