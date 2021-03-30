import * as Discord from 'discord.js'
import dotenv from 'dotenv'
import { Message } from 'discord.js'
import { readMessage } from './messages'

dotenv.config()

const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client?.user?.tag}!`)
})

client.on('message', (msg: Message) => {
  return readMessage(msg)
})

client.login(process?.env?.BOT_TOKEN)
