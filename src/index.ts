import * as Discord from 'discord.js'
import dotenv from 'dotenv'
import { Message } from 'discord.js'
import { readMessage } from './messages'
import { client as dbClient } from './config/database'

dotenv.config()

const client = new Discord.Client()

dbClient.connect().then(() => {
  dbClient.query('SELECT NOW()').then(() => {
    dbClient.end()
  })
})

client.on('ready', () => {
  console.log(`Logged in as ${client?.user?.tag}!`)
})

client.on('message', (msg: Message) => {
  return readMessage(msg)
})

client.login(process?.env?.BOT_TOKEN)
