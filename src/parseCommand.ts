import { Message } from 'discord.js'
import { handleLoadCommand } from './commands/load'
import { guardedFunctionWrapper, UserRole } from './guards/rolesGuard'
import { helpCommand } from './commands/help'
import { getVariantsFromSavedLinks } from './commands/getVariantsFromSavedLinks'
import { MarketPlaces } from './common/constants'
import { deleteLink } from './commands/deleteLink'
import { listLinks } from './commands/listLinks'

export const parseCommand = async (message: Message): Promise<Message> => {
  const { content } = message || {}

  /**
   * HELP COMMAND
   */
  if (content?.startsWith('!snk-bot help')) {
    return helpCommand(message)
  }

  /**
   * LOAD LINKS COMMAND
   */
  if (content?.startsWith('!snk load') || content?.startsWith('!sp load')) {
    const loadCommand = await guardedFunctionWrapper(
      message,
      [UserRole.SUPPORT, UserRole.MODERATOR, UserRole.ADMIN, UserRole.DEVS],
      handleLoadCommand
    )
    return loadCommand(message)
  }

  /**
   * SHOW VARIANTS COMMAND
   */
  if (content?.startsWith('!snk variants')) {
    const getVariantsCommand = await guardedFunctionWrapper(
      message,
      [UserRole.SUPPORT, UserRole.MODERATOR, UserRole.ADMIN, UserRole.DEVS],
      getVariantsFromSavedLinks
    )
    return getVariantsCommand(message, MarketPlaces.SHOP_NICE_KICKS)
  }

  if (content?.startsWith('!sp variants')) {
    const getVariantsCommand = await guardedFunctionWrapper(
      message,
      [UserRole.SUPPORT, UserRole.MODERATOR, UserRole.ADMIN, UserRole.DEVS],
      getVariantsFromSavedLinks
    )
    return getVariantsCommand(message, MarketPlaces.SHOE_PALACE)
  }

  /**
   * DELETE LINK COMMAND
   */
  if (content?.startsWith('!snk delete')) {
    const deleteLinkCommand = await guardedFunctionWrapper(message, [UserRole.SUPPORT, UserRole.MODERATOR, UserRole.ADMIN, UserRole.DEVS], deleteLink)
    return deleteLinkCommand(message, MarketPlaces.SHOP_NICE_KICKS)
  }

  if (content?.startsWith('!sp delete')) {
    const deleteLinkCommand = await guardedFunctionWrapper(message, [UserRole.SUPPORT, UserRole.MODERATOR, UserRole.ADMIN, UserRole.DEVS], deleteLink)
    return deleteLinkCommand(message, MarketPlaces.SHOE_PALACE)
  }

  /**
   * LIST LINKS COMMAND
   */
  if (content?.startsWith('!snk list')) {
    const listLinksCommand = await guardedFunctionWrapper(message, [UserRole.SUPPORT, UserRole.MODERATOR, UserRole.ADMIN, UserRole.DEVS], listLinks)
    return listLinksCommand(message, MarketPlaces.SHOP_NICE_KICKS)
  }

  if (content?.startsWith('!sp list')) {
    const listLinksCommand = await guardedFunctionWrapper(message, [UserRole.SUPPORT, UserRole.MODERATOR, UserRole.ADMIN, UserRole.DEVS], listLinks)
    return listLinksCommand(message, MarketPlaces.SHOE_PALACE)
  }
}
