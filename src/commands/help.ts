import { Message, MessageEmbed } from 'discord.js'

/**
 * Add commands to be listed here, with helpful description
 * on how to use each one of them
 */
const createEmbededMessage = () => {
  return new MessageEmbed()
    .setTitle('Commands list')
    .setColor(0x4a6fc3)
    .addField(`\`\`\`!snk load SHOP_NICE_KICKS_PRODUCT_LINKS\`\`\``, `Pass a link or list of shop nice kicks links to load into the bot`)
    .addField(`\`\`\`!sp load SHOE_PALACE_PRODUCT_LINKS\`\`\``, `Pass a link or list of shoe palace links to load into the bot`)
}

export const helpCommand = async (message: Message): Promise<Message> => {
  return message.channel.send(createEmbededMessage())
}
