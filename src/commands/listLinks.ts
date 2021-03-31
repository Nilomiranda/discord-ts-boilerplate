import { Message, MessageEmbed } from 'discord.js'
import { MarketPlaces } from '../common/constants'
import { loadLinks } from '../services/links'

const createEmbeddedMessage = (links: string[] = [], marketplace: MarketPlaces) => {
  if (!links?.length) {
    return `Your list of ${marketplace === MarketPlaces.SHOE_PALACE ? 'Shoe Palace' : 'Shop Nice Kicks'} links is empty`
  }

  return new MessageEmbed()
    .setTitle(`${marketplace === MarketPlaces.SHOE_PALACE ? 'Shoe Palace' : 'Shop Nice Kicks'} saved links`)
    .addFields(links?.map((link) => ({ value: link, inline: false, name: 'Link' })))
}

export const listLinks = async (message: Message, marketplace: MarketPlaces): Promise<Message> => {
  const loadedLinks = await loadLinks(message, marketplace)
  console.log({ loadedLinks })

  const embeddedMessage = createEmbeddedMessage(loadedLinks, marketplace)

  return message.channel.send(embeddedMessage)
}
