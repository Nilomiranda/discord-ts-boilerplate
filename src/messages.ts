import * as Discord from 'discord.js'
import { MessageEmbed } from 'discord.js'
import { extractUrls, isUrl } from './common/identifyUrl'
import { JSDOM } from 'jsdom'
import { MarketPlaces, SHOE_PALACE, SHOP_NICE_KICKS } from './common/constants'
import { Product, ProductVariant } from './common/interfaces'

interface LinksSplitDataObject {
  shoePalace: string[]
  shopNiceKicks: string[]
}

// from user message to bot, extract any valid URL
const getLinks = (content: string): string[] => {
  return extractUrls(content)
}

// will split links in separate arrays for Shoe Palace and Shop Nice Kicks
const splitLinks = (links: string[]): LinksSplitDataObject => {
  if (!links?.length) {
    return {
      shoePalace: [],
      shopNiceKicks: [],
    }
  }

  return {
    shoePalace: Array.from(new Set(links.filter((link) => link?.includes(SHOE_PALACE)))) || [],
    shopNiceKicks: Array.from(new Set(links.filter((link) => link?.includes(SHOP_NICE_KICKS)))) || [],
  }
}

// get product information from each link
const extractInformationFromLinks = (
  links: string[] = [],
  domQuerySelectorToExtractProductData: string
): Promise<Product[] | { product: Product }[]> => {
  return new Promise(async (resolve) => {
    const extractedInformation: any[] = []
    const lastLinkIndex = links.length - 1

    if (!links?.length) {
      resolve([])
    }

    for (let index = 0; index < links.length; index++) {
      const link = links[index]

      // skip iteration if link is not a valid url
      if (!isUrl(link) || !domQuerySelectorToExtractProductData) {
        continue
      }

      const dom = await JSDOM.fromURL(link)

      if (dom) {
        const serializedDOM = dom?.serialize()

        if (serializedDOM) {
          const nodeWindow = new JSDOM().window
          const domParser = new nodeWindow.DOMParser()
          const parsedHTMLContent = domParser.parseFromString(serializedDOM, 'text/html')
          const scriptTag = parsedHTMLContent.querySelector(domQuerySelectorToExtractProductData)
          const productInformation = JSON.parse(scriptTag.textContent)
          extractedInformation.push(productInformation)
          if (index >= lastLinkIndex) {
            resolve(extractedInformation)
          }
        }
      }
    }
  })
}

// from extract information, read and map to a better format to create the embeds
const readAndFormatInformation = (
  productInformation: Product[] | { product: Product }[] = [],
  marketplace: MarketPlaces
): { thumbnail: string; variants: ProductVariant[]; title: string }[] => {
  if (!productInformation?.length) {
    return null
  }

  if (marketplace === SHOE_PALACE) {
    return productInformation?.map((productInfo) => {
      return {
        title: productInfo?.title,
        thumbnail: productInfo?.media && productInfo?.media[0] ? productInfo?.media[0].src : '',
        variants: productInfo?.variants,
      }
    })
  }

  if (marketplace === SHOP_NICE_KICKS) {
    return productInformation?.map((productInfo) => {
      return {
        title: productInfo?.product?.title,
        thumbnail:
          productInfo?.product?.media && productInfo?.product?.media[0] ? productInfo?.product?.media[0].src : '',
        variants: productInfo?.product?.variants,
      }
    })
  }

  return null
}

// central function to call each function above and pass formatted data to callee
const processLinks = (
  links: string[]
): Promise<{ thumbnail: string; variants: ProductVariant[]; title: string }[][]> => {
  return new Promise<any>(async (resolve, reject) => {
    if (!links?.length) {
      reject('Please load at least one lin')
    }

    const { shoePalace, shopNiceKicks }: LinksSplitDataObject = splitLinks(links)

    const shoePalaceDomQuerySelector = 'script[id="ProductJson--product-template"]'
    const shopNiceKicksDomQuerySelector = 'script[data-product-json]'

    const shoePalaceInformation: Product[] = (await extractInformationFromLinks(
      shoePalace,
      shoePalaceDomQuerySelector
    )) as Product[]
    const shopNiceKicksInformation: {
      product: Product
    }[] = (await extractInformationFromLinks(shopNiceKicks, shopNiceKicksDomQuerySelector)) as { product: Product }[]

    resolve([
      readAndFormatInformation(shoePalaceInformation, MarketPlaces.SHOE_PALACE),
      readAndFormatInformation(shopNiceKicksInformation, MarketPlaces.SHOP_NICE_KICKS),
    ])
  })
}

// create discord embed response format
const createEmbedResponse = (mappedData: any[], marketplace: MarketPlaces) => {
  return mappedData?.map((data) => {
    return new MessageEmbed()
      .setTitle(data?.title)
      .setThumbnail(data?.thumbnail)
      .setColor(0x4a6fc3)
      .addField(
        'Size-Variant',
        `\`\`\`${data?.variants
          ?.map(
            (variant) =>
              `${marketplace === MarketPlaces.SHOE_PALACE ? variant?.option2 : variant?.option1}-${variant?.id}\n`
          )
          .join('')}\`\`\``,
        true
      )
      .addField('Variant', `\`\`\`${data?.variants?.map((variant) => `${variant?.id}\n`).join('')}\`\`\``, true)
  })
}

// read message, and call function to process links (if they were passed
export const readMessage = async (message: Discord.Message) => {
  const { content } = message || {}

  if (!content) {
    return message.reply('Sorry, I cannot understand that')
  }

  if (content.startsWith('!snk load') || content.startsWith('!sp load')) {
    const links: string[] = getLinks(content)
    if (!links?.length) {
      return message.reply('Please, inform at least one link')
    }

    try {
      message.reply(`Wait while we process the link${links?.length && links?.length > 1 ? 's' : ''}`)
      const [shoePalaceResponse, shopNiceKicksResponse] = await processLinks(links)

      const shoePalaceEmbeds = createEmbedResponse(shoePalaceResponse, MarketPlaces.SHOE_PALACE)

      const shopNiceKicksEmbeds = createEmbedResponse(shopNiceKicksResponse, MarketPlaces.SHOP_NICE_KICKS)

      const embeds = [...shoePalaceEmbeds, ...shopNiceKicksEmbeds]

      embeds.forEach((embed) => {
        message.channel.send(embed)
      })
    } catch (err) {
      message.reply(`Sorry, we couldn't process your link${links?.length && links?.length > 1 ? 's' : ''}`)
      message.reply(err)
    }
  }
}
