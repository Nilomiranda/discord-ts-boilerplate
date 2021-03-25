import * as Discord from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client?.user?.tag}!`)
})

client.on('message', msg => {
  if (msg?.content?.startsWith('!snk') || msg?.content?.startsWith('!sp')) {
    msg.reply('Hello, I identified your correct usage of my prefix')
  }
})

client.login(process?.env?.BOT_TOKEN)