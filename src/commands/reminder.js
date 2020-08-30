const ReminderSchema = require("../schemas/ReminderSchema");
const { Message } = require('discord.js');

/*
    This function creates a reminder and posts
    it to the MongoDB database.
*/
const createReminder = async ({ message, dayOccurance }, client) => {
    // Create newSetDate Date
    let newSetDate = new Date();
    // create nextTimeToSendReminder date
    let nextTimeToSendReminder = new Date();
    // Add occurance of days 
    nextTimeToSendReminder = nextTimeToSendReminder.addDays(
        dayOccurance
    );

    // Create the ReminderSchema object 
    const rs = new ReminderSchema({
        channelId: client.channel.id,
        message,
        dayOccurance,
        setDate: newSetDate,
        nextReminderDate: nextTimeToSendReminder,
    });

    // Save to the database
    await rs.save((error) => {
        if (error) {
            console.log("ERROR SAVING REMINDER");
        } else {
            client.reply(
                `\`\`\`
            \nThe Following Message Will Be Saved: 
            \nReminder saved in channel ID: ${rs.channelId}
            \nReminder message: ${rs.message}                    
            \nReminder set date: ${rs.dayOccurance}
            \nDays before reminder: ${rs.setDate}
            \nnextTimeToSendReminder: ${rs.nextReminderDate}
            \`\`\``
            );
        }
    });
};

/*
    This function sends a mesasge to the channel
    displaying the current reminders set to the channel.
*/
const getReminder = async client => {
    await ReminderSchema.find({ channelId: client.channel.id })
        .populate("reminders")
        .exec((error, document) => {
            if (error) {
                console.log(error);
            } else {
                client.reply("HERE ARE YOUR REMINDERS\n");
                document.forEach((reminder) => {
                    client.reply(displayReminder(reminder));
                });
            }
        });
};

const deleteReminder = async (client, reminderId) => {
    await ReminderSchema.findByIdAndDelete(reminderId, (error, document) => {
        if (error) {
            console.log(error);
            client.reply("ERROR DELETING REMINDER. TRY AGAIN LATER");
        }
        else {
            if (!document) {
                client.reply("Reminder ID is not valid or has been already deleted");
                return;
            }
            client.reply(`The following reminder has been deleted:\n ${displayReminder(document)}`);
        }
    });
}

const sendReminders = async (client, channels) => {
    channels.forEach(channel => {
        console.log(channel.id);
        ReminderSchema.find({channelId: channel.id})
            .populate('reminders')
            .exec((error, document) => {
                if (error) {
                    channel.send("ERROR");
                }
                if (document) {
                    document.forEach(reminder => channel.send(displayReminder(reminder)));
                }
            });
    })
}

const displayReminder = (reminder) => {
    return `\`\`\`
    \nReminder ID: ${reminder._id}
    \nMessage: ${reminder.message}
    \nOccurance: ${reminder.dayOccurance} day(s)
    \nNext Time For Reminder: ${reminder.nextReminderDate}
     \`\`\``;
};

// Add Days prototype function
// Taken from stackoverflow
Date.prototype.addDays = (days) => {
    let date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

module.exports = { 
    createReminder, 
    getReminder, 
    deleteReminder, 
    sendReminders };