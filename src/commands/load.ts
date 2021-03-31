import * as Discord from 'discord.js'
import { Message } from 'discord.js'
import { extractUrls } from '../common/identifyUrl'
import { SHOE_PALACE, SHOP_NICE_KICKS } from '../common/constants'
import { saveLinks } from '../services/links'

// from user message to bot, extract any valid URL
const getLinks = (content: string): string[] => {
  // returnning an Array from a set will remove duplcated links
  return Array.from(new Set(extractUrls(content)))
}

export const checkForInvalidLinks = (message: string, links: string[] = []): { invalidLinks: boolean; message?: string } => {
  if (!links?.length) {
    return { invalidLinks: false }
  }

  if (message.includes('!snk') && links?.filter((link) => link.includes(SHOE_PALACE))?.length) {
    return { invalidLinks: true, message: "This command only accepts Shop Nice Kicks' links" }
  }

  if (message.includes('!sp') && links?.filter((link) => link.includes(SHOP_NICE_KICKS))?.length) {
    return { invalidLinks: true, message: "This command only accepts Shoe Palace's links" }
  }

  return { invalidLinks: false }
}

export const handleLoadCommand = async (message: Discord.Message): Promise<Message> => {
  const { content } = message || {}

  const links: string[] = getLinks(content)
  if (!links?.length) {
    return message.reply('Please, inform at least one link')
  }

  const { invalidLinks, message: invalidLinksMessage } = checkForInvalidLinks(content, links)

  if (invalidLinks) {
    return message.reply(invalidLinksMessage)
  }

  try {
    message.reply(`Saving your link${links?.length && links?.length > 1 ? 's' : ''}`)
    await saveLinks(links, message)
    message.reply(`Link${links?.length && links?.length > 1 ? 's' : ''} saved.`)
  } catch (err) {
    message.reply(`Sorry, we couldn't process your link${links?.length && links?.length > 1 ? 's' : ''}`)
  }
}
