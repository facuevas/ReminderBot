// Import packages
const Discord = require('discord.js');
require('dotenv').config();
const config = require('./config.json');
const mongoose = require('mongoose');
const { createReminder,
    getReminder,
    deleteReminder,
    sendReminders,
    clearAllReminders } = require('./commands/reminder');

// Connect to MongoDB database
const uri = process.env.ATLAS_DB_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Successfully connected to the MongoDB Atlas Cloud Database");
})

// Initiate discord client
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    const channelsConnected = client.channels.cache.array();
    const textChannels = channelsConnected.filter(channel => channel.type === 'text');
    const todaysDate = {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    }
    sendReminders(client, textChannels, todaysDate);
});

// Parse through messages
client.on('message', msg => {
    // split message content into newlines
    let args = msg.content.split("\n");

    // if args array is 1
    // there are no new lines
    // instead, split as spaces
    if (args.length === 1) {
        args = msg.content.split(" ");
    }

    if (config.prefix.includes(args[0])) {

        switch (args[0]) {
            case "createreminder!":
                // we want three arguments separated by newlines
                // first argument is our prefix command
                // second argument is our reminder message
                // third argument is our reminder occurance
                if (args.length !== 3) {
                    msg.reply("ERROR. Please format as following: \`\`\`createreminder! \nreminder message \nnumber of days in between reminder\`\`\`");
                    return;
                }
                const reminder = {
                    message: args[1],
                    dayOccurance: parseInt(args[2])
                };
                createReminder(reminder, msg);
                break;
            case "getreminders!":
                getReminder(msg);
                break;
            case "deletereminder!":
                const reminderId = args[1];
                if (!reminderId) {
                    msg.reply("To delete reminders, format as \`\`\`deletereminder! reminderID\`\`\`");
                    return;
                }
                deleteReminder(msg, reminderId);
                break;
            case "remindme!":
                msg.channel.send("The commands are: \n```createreminder! - Create a reminder \ngetreminders! - View reminders on the channel \ndeletereminder! - Delete specified reminder with id \nclearreminders! - Clear all reminders in the channel```");
                break;
            case "clearreminders!":
                clearAllReminders(msg);
                break;
        }
    }
});

client.login(process.env.DISCORD_TOKEN);