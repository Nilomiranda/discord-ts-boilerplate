import Discord, { Message } from 'discord.js'
import { handleLoadCommand } from './commands/load'
import { guardedFunctionWrapper, UserRole } from './guards/rolesGuard'

export const parseCommand = async (message: Discord.Message): Promise<Message> => {
  const { content } = message || {}

  if (content?.startsWith('!snk load') || content?.startsWith('!sp load')) {
    const loadCommand = await guardedFunctionWrapper(message, [UserRole.SUPPORT, UserRole.MODERATORS, UserRole.ADMIN], handleLoadCommand)
    return loadCommand(message)
  }
}
