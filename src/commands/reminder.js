const reminderSchema = require('../schemas/reminderSchema');
// TODO
// Create a reminder and post it to the mongoDB database
const createReminder = async (reminder, msg) => {
    let newSetDate = new Date();
    let nextTimeToSendReminder = new Date();
    nextTimeToSendReminder = nextTimeToSendReminder.addDays(reminder.reminderDayCycle);
    await msg.reply(
        `\`\`\`
        \nThe Following Message Will Be Saved: 
        \nReminder set by: ${reminder.setByUser}
        \nReminder message: ${reminder.reminderMessage}                    
        \nReminder set date: ${newSetDate}
        \nDays before reminder: ${reminder.reminderDayCycle}
        \nnextTimeToSendReminder: ${nextTimeToSendReminder}
        \`\`\``);
};


// Add Days prototype function
// Taken from stackoverflow
Date.prototype.addDays = days => {
    let date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};


exports.createReminder = createReminder;