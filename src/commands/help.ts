import { Message, MessageEmbed } from 'discord.js'
import { DISCORD_BOT_IMAGE_URL } from '../common/constants'

/**
 * Add commands to be listed here, with helpful description
 * on how to use each one of them
 */
const createEmbededMessage = () => {
  return new MessageEmbed()
    .setTitle('Commands list')
    .setColor(0x4a6fc3)
    .addField(`\`\`\`!snk load SHOP_NICE_KICKS_PRODUCT_LINKS\`\`\``, `Pass a link or list of shop nice kicks links to load into the bot`)
    .addField(`\`\`\`!snk variants\`\`\``, `Get variants of shop nice kicks  links`)
    .addField(`\`\`\`!snk delete SHOP_NICE_KICKS_PRODUCT_LINKS\`\`\``, `Delete links saved from shop nice kicks products`)
    .addField(`\`\`\`!snk list\`\`\``, `List saved shop nice kicks product links`)

    .addField(`\`\`\`!sp load SHOE_PALACE_PRODUCT_LINKS\`\`\``, `Pass a link or list of shoe palace links to load into the bot`)
    .addField(`\`\`\`!sp variants\`\`\``, `Get variants of shoe palace links`)
    .addField(`\`\`\`!sp delete SHOE_PALACE_PRODUCT_LINKS\`\`\``, `Delete links saved from shoe palace products`)
    .addField(`\`\`\`!sp list\`\`\``, `List saved shoe palace product links`)

    .setFooter('Calicos LOAD', DISCORD_BOT_IMAGE_URL)
}

export const helpCommand = async (message: Message): Promise<Message> => {
  return message.channel.send(createEmbededMessage())
}
