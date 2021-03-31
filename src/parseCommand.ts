import { Message } from 'discord.js'
import { handleLoadCommand } from './commands/load'
import { guardedFunctionWrapper, UserRole } from './guards/rolesGuard'
import { helpCommand } from './commands/help'
import { getVariantsFromSavedLinks } from './commands/getVariantsFromSavedLinks'
import { MarketPlaces } from './common/constants'
import { deleteLink } from './commands/deleteLink'

export const parseCommand = async (message: Message): Promise<Message> => {
  const { content } = message || {}

  if (content?.startsWith('!snk-bot help')) {
    return helpCommand(message)
  }

  if (content?.startsWith('!snk load') || content?.startsWith('!sp load')) {
    const loadCommand = await guardedFunctionWrapper(
      message,
      [UserRole.SUPPORT, UserRole.MODERATORS, UserRole.ADMIN, UserRole.DEVS],
      handleLoadCommand
    )
    return loadCommand(message)
  }

  if (content?.startsWith('!snk variants')) {
    const getVariantsCommand = await guardedFunctionWrapper(
      message,
      [UserRole.SUPPORT, UserRole.MODERATORS, UserRole.ADMIN, UserRole.DEVS],
      getVariantsFromSavedLinks
    )
    return getVariantsCommand(message, MarketPlaces.SHOP_NICE_KICKS)
  }

  if (content?.startsWith('!sp variants')) {
    const getVariantsCommand = await guardedFunctionWrapper(
      message,
      [UserRole.SUPPORT, UserRole.MODERATORS, UserRole.ADMIN, UserRole.DEVS],
      getVariantsFromSavedLinks
    )
    return getVariantsCommand(message, MarketPlaces.SHOE_PALACE)
  }

  if (content?.startsWith('!snk delete')) {
    const deleteLinkCommand = await guardedFunctionWrapper(
      message,
      [UserRole.SUPPORT, UserRole.MODERATORS, UserRole.ADMIN, UserRole.DEVS],
      deleteLink
    )
    return deleteLinkCommand(message, MarketPlaces.SHOP_NICE_KICKS)
  }

  if (content?.startsWith('!sp delete')) {
    const deleteLinkCommand = await guardedFunctionWrapper(
      message,
      [UserRole.SUPPORT, UserRole.MODERATORS, UserRole.ADMIN, UserRole.DEVS],
      deleteLink
    )
    return deleteLinkCommand(message, MarketPlaces.SHOE_PALACE)
  }
}
