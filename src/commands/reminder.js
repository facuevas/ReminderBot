const ReminderSchema = require("../schemas/reminderSchema");
const { Message } = require("discord.js");

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
    nextTimeToSendReminder = nextTimeToSendReminder.addDays(dayOccurance);

    // Create the ReminderSchema object
    const rs = new ReminderSchema({
        channelId: client.channel.id,
        message,
        dayOccurance,
        setDate: newSetDate,
        nextReminderDate: nextTimeToSendReminder,
    });

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
};

/*
    This function sends a mesasge to the channel
    displaying the current reminders set to the channel.
*/
const getReminder = async (client) => {
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

/*
    This function deletes a reminder from
    the mongoDB database
*/
const deleteReminder = async (client, reminderId) => {
    await ReminderSchema.findByIdAndDelete(reminderId, (error, document) => {
        if (error) {
            console.log(error);
            client.reply("ERROR DELETING REMINDER. TRY AGAIN LATER");
        } else {
            if (!document) {
                client.reply("Reminder ID is not valid or has been already deleted");
                return;
            }
            client.reply(
                `The following reminder has been deleted:\n ${displayReminder(
                    document
                )}`
            );
        }
    });
};

const clearAllReminders = async (client) => {
    const channelId = client.channel.id;
    await ReminderSchema.deleteMany({ channelId: channelId })
        .then(
            client.channel.send(`Clearing all reminders for channel ID ${channelId}`)
        )
        .catch(console.log("All reminders deleted already."));
};

/*
    When this function is called, it sends all the reminders
    for the channel if it is supposed to be called that day.
*/
const sendReminders = async (client, channels, todaysDate) => {
    console.log("SENDING REMINDERS");
    channels.forEach((channel) => {
        ReminderSchema.find({ channelId: channel.id })
            .populate("reminders")
            .exec((error, document) => {
                if (error) {
                    channel.send("ERROR");
                }
                if (document) {
                    //document.forEach(reminder => channel.send(displayReminder(reminder)));
                    document.forEach((reminder) => {
                        const nextReminderDate = {
                            day: reminder.nextReminderDate.getDate(),
                            month: reminder.nextReminderDate.getMonth() + 1,
                            year: reminder.nextReminderDate.getFullYear(),
                        };
                        if (areDatesEqual(nextReminderDate, todaysDate)) {
                            reminder.nextReminderDate = reminder.nextReminderDate.addDays(
                                reminder.dayOccurance
                            );
                            reminder.save((error) => {
                                if (error) {
                                    console.log(error);
                                }
                            });
                            channel.send(displayReminder(reminder));
                        }
                        // Update next reminder date
                    });
                }
            });
    });
};

const areDatesEqual = (date1, date2) => {
    return JSON.stringify(date1) == JSON.stringify(date2);
};

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
    sendReminders,
    clearAllReminders,
};
