// Import packages
const Discord = require('discord.js');
require('dotenv').config();
const config = require('./config.json');
const mongoose = require('mongoose');
const { createReminder } = require('./commands/reminder');

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
});

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

        const user = msg.author.username;

        switch (args[0]) {

            case "createreminder!":
                // we want three arguments separated by newlines
                // first argument is our prefix command
                // second argument is our reminder message
                // third argument is our reminder occurance
                if (args.length !== 3) {
                    msg.reply("ERROR. Please format as following: ```createreminder! \nreminder message \nreminder occurance (1d, 2w, 3y)```");
                }
                const reminder = {
                    setByUser: user,
                    reminderMessage: args[1],
                    reminderDayCycle: parseInt(args[2]),
                };
                createReminder(reminder, msg);
                break;
            case "getreminder!":
                msg.reply("here are your reminders");
                break;
        }
    }
});

client.login(process.env.DISCORD_TOKEN);