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
    const args = msg.content.split(" ");
    if (config.prefix.includes(args[0])) {
        msg.reply(args[1]);
    }
});

client.login(process.env.DISCORD_TOKEN);