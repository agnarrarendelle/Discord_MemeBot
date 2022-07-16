import dotenv from 'dotenv'
import discord from 'discord.js'
import { Client, Intents } from "discord.js"

import utility from './utility'
dotenv.config()
const client = new discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const token = process.env.TOKEN

client.login(token)

client.on('ready', ()=>{
    console.info(`Logged in as ${client.user!.tag}!`);
})

client.on("messageCreate", (message)=>{
    utility.setUpCommandReact(message)
})


