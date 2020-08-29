const ReminderSchema = require('../schemas/ReminderSchema');
const { User } = require('discord.js');
// TODO
// Create a reminder and post it to the mongoDB database
const createReminder = async (reminder, msg) => {
    let newSetDate = new Date();
    let nextTimeToSendReminder = new Date();
    nextTimeToSendReminder = nextTimeToSendReminder.addDays(reminder.reminderDayCycle);

    
        // REFACTOR THIS.
        // WE CAN WRITE THIS CLEANER
        // FOR NOW LET'S POST TO DATABASE
        const newRS = {
            setByUser: reminder.setByUser,
            reminderMessage: reminder.reminderMessage,
            reminderSetDate: newSetDate,
            reminderDayCycle: reminder.reminderDayCycle,
            nextTimeToSendReminder: nextTimeToSendReminder
        }
        const rs = new ReminderSchema(newRS);
        await rs.save(error => {
            if (error) {
                console.log("ERROR SAVING REMINDER");
            }
            else {
                msg.reply(
                    `\`\`\`
                    \nThe Following Message Will Be Saved: 
                    \nReminder set by: ${reminder.setByUser}
                    \nReminder message: ${reminder.reminderMessage}                    
                    \nReminder set date: ${newSetDate}
                    \nDays before reminder: ${reminder.reminderDayCycle}
                    \nnextTimeToSendReminder: ${nextTimeToSendReminder}
                    \`\`\``);
            }
        });
};

// DISPLAY THE REMINDERS
const getReminderByUser = async (msg, caller) => {
    await ReminderSchema.find({ setByUser: caller}).populate('reminders').exec((error, document) => {
        if (error) {
            console.log(error);
        }
        else {
            msg.reply("HERE ARE YOUR REMINDERS\n");
            document.forEach(reminder => {
                msg.reply(displayReminder(reminder));
            }) 
            console.log(document);
        }
    });
    //await MyModel.find({ name: 'john', age: { $gte: 18 } }).exec();
}

const remind = async (msg) => {
    await ReminderSchema.find({ setByUser: caller}).populate('reminders').exec((error, document) => {
        if (error) {
            console.log(error);
        }
        else {
            msg.reply("HERE ARE YOUR REMINDERS\n");
            document.forEach(reminder => {
                msg.reply(displayReminder(reminder));
            }) 
            console.log(document);
        }
    });
}

const updateReminder = async (reminder) => {

}

const displayReminder = reminder => {
    return `\`\`\`
    \nMessage: ${reminder.reminderMessage}
    \nOccurance: ${reminder.reminderDayCycle} day(s)
    \nNext Time For Reminder: ${reminder.nextTimeToSendReminder}
     \`\`\``;
}

// Add Days prototype function
// Taken from stackoverflow
Date.prototype.addDays = days => {
    let date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};


exports.createReminder = createReminder;
exports.getReminderByUser = getReminderByUser;
exports.remind = remind;