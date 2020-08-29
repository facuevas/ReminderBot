const userSchema = require('../schemas/reminderSchema');
// TODO
// Create a reminder and post it to the mongoDB database
const createReminder = async (reminder, msg) => {
    console.log(reminder);
    await msg.reply("REMINDER MESSAGE: " + reminder.reminderMessage);
};


exports.createReminder = createReminder;