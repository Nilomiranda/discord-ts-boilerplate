import { Message } from 'discord.js'

export const parseCommand = async (message: Message): Promise<Message> => {
  const { content } = message || {}
}
