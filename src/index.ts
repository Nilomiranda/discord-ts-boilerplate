import * as Discord from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client?.user?.tag}!`)
})

client.on('message', msg => {
  console.log(msg?.content)
})

client.login(process?.env?.BOT_TOKEN)