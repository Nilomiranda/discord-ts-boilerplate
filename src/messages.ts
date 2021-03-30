// read message, and call function to process links (if they were passed
import { Message } from 'discord.js'
import { parseCommand } from './parseCommand'

export const readMessage = async (message: Message): Promise<Message> => {
  console.log(message?.member)
  return parseCommand(message)
}
