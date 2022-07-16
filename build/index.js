import dotenv from 'dotenv';
import discord from 'discord.js';
import utility from './utility';
//configure environment
dotenv.config();
//set bot token from .env file
const token = process.env.TOKEN;
//set bot intents
const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES] });
//make the bot login in the discord server
client.login(token);
//an event listener that prints the logging message when the bot is activated
client.on('ready', () => {
    console.info(`Logged in as ${client.user.tag}!`);
});
//an event listener that is called whenever users enter message in the Discord server
client.on("messageCreate", (message) => {
    utility.setUpCommandReact(message);
});
