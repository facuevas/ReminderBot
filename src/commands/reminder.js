const ReminderSchema = require("../schemas/ReminderSchema");

// TODO
// Create a reminder and post it to the mongoDB database
const createReminder = async ({ message, dayOccurance }, client) => {
    let newSetDate = new Date();
    let nextTimeToSendReminder = new Date();
    nextTimeToSendReminder = nextTimeToSendReminder.addDays(
        dayOccurance
    );
    console.log(client.channel.id);
    // REFACTOR THIS.
    // WE CAN WRITE THIS CLEANER
    // FOR NOW LET'S POST TO DATABASE
    const newRS = {
        channelId: client.channel.id,
        message,
        dayOccurance,
        setDate: newSetDate,
        nextReminderDate: nextTimeToSendReminder,
    };
    const rs = new ReminderSchema(newRS);
      await rs.save((error) => {
        if (error) {
          console.log("ERROR SAVING REMINDER");
        } else {
            client.reply(
            `\`\`\`
            \nThe Following Message Will Be Saved: 
            \nReminder saved in channel ID: ${newRS.channelId}
            \nReminder message: ${newRS.message}                    
            \nReminder set date: ${newRS.dayOccurance}
            \nDays before reminder: ${newRS.setDate}
            \nnextTimeToSendReminder: ${newRS.nextReminderDate}
            \`\`\``
            );
        }
      });
};

// DISPLAY THE REMINDERS
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

const displayReminder = (reminder) => {
    return `\`\`\`
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

exports.createReminder = createReminder;
exports.getReminder = getReminder;
