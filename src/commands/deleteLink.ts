import { Message } from 'discord.js'
import { MarketPlaces } from '../common/constants'
import { deleteLinks } from '../services/links'
import { extractUrls } from '../common/identifyUrl'
import { checkForInvalidLinks } from './load'

export const deleteLink = async (message: Message, marketplace: MarketPlaces): Promise<Message> => {
  const links: string[] = extractUrls(message?.content)

  const { invalidLinks, message: invalidLinksMessage } = checkForInvalidLinks(message?.content, links)

  if (invalidLinks) {
    return message.reply(invalidLinksMessage)
  }

  try {
    const deleted: boolean = await deleteLinks(message, marketplace, links)
    if (deleted) {
      return message.reply('Links delete successfully')
    }

    return message.reply('No links to delete')
  } catch (err) {
    return message.reply('Links could not be deleted, please try again')
  }
}
