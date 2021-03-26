import * as Discord from 'discord.js'
import {extractUrls, isUrl} from "./common/identifyUrl";
import {JSDOM} from 'jsdom'
import {MarketPlaces, SHOE_PALACE, SHOP_NICE_KICKS} from "./common/constants";
import {MessageEmbed} from "discord.js";

interface LinksSplitDataObject {
  shoePalace: string[];
  shopNiceKicks: string[];
}

const getLinks = (content: string): string[] => {
  return extractUrls(content)
}

const splitLinks = (links: string[]): LinksSplitDataObject => {
  if (!links?.length) {
    return {
      shoePalace: [],
      shopNiceKicks: [],
    }
  }

  return {
    shoePalace: Array.from(new Set(links.filter(link => link?.includes(SHOE_PALACE)))) || [],
    shopNiceKicks: Array.from(new Set(links.filter(link => link?.includes(SHOP_NICE_KICKS)))) || [],
  }
}

const extractInformationFromLinks = (links: string[] = [], domQuerySelectorToExtractProductData: string): Promise<any[]> => {
  return new Promise(async (resolve) => {
    const extractedInformation: any[] = [];
    const lastLinkIndex = links.length - 1;

    if (!links?.length) {
      resolve([])
    }

    for (let index = 0; index < links.length; index++) {
      let link = links[index];

      // skip iteration if link is not a valid url
      if (!isUrl(link) || !domQuerySelectorToExtractProductData) {
        continue
      }

      const dom = await JSDOM.fromURL(link);

      if (dom) {
        const serializedDOM = dom?.serialize()

        if (serializedDOM) {
          const nodeWindow = new JSDOM().window
          const domParser = new nodeWindow.DOMParser()
          const parsedHTMLContent = domParser.parseFromString(serializedDOM, 'text/html');
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

const readAndFormatInformation = (productInformation: any[] = [], marketplace: MarketPlaces) => {
  if (!productInformation?.length) {
    return null;
  }

  if (marketplace === SHOE_PALACE) {
    const mappedInformation = productInformation?.map((productInfo, index) => {
      return {
        title: productInfo?.title,
        thumbnail: productInfo?.media[0] ? productInfo?.media[0].src : '',
        variants: productInfo?.variants,
      }
    })
    return mappedInformation;
    // return [{name: 'Title', value: 'productInfo.title', inline: true}];
  }

  return null

  // todo add handler for shop nice kicks
}

const processLinks = (links: string[]): Promise<any> => {
  return new Promise<any>(async (resolve, reject) => {
    if (!links?.length) {
      reject('Please load at least one link')
    }

    const { shoePalace, shopNiceKicks }: LinksSplitDataObject = splitLinks(links)

    const shoePalaceDomQuerySelector = 'script[id="ProductJson--product-template"]'
    const shopNiceKicksDomQuerySelector = 'script[data-product-json]'

    const shoePalaceInformation: any[] = await extractInformationFromLinks(shoePalace, shoePalaceDomQuerySelector)
    const shopNiceKicksInformation: any[] = await extractInformationFromLinks(shopNiceKicks, shopNiceKicksDomQuerySelector)

    resolve(readAndFormatInformation(shoePalaceInformation, MarketPlaces.SHOE_PALACE))

    // resolve([...shoePalaceInformation, ...shopNiceKicksInformation])
  })
}

export const readMessage = async (message: Discord.Message) => {
  const { content } = message || {};

  if (!content) {
    return message.reply('Sorry, I cannot understand that');
  }

  if (content.startsWith('!snk load') || content.startsWith('!sp load')) {
    const links: string[] = getLinks(content);
    if (!links?.length) {
      return message.reply('Please, inform at least one link')
    }

    try {
      message.reply(`Wait while we process the link${links?.length && links?.length > 1 ? 's' : ''}`)
      const response = await processLinks(links)
      console.log({ response })
      const embeds = response?.map(res => {
        const embed = new MessageEmbed()
          .setTitle(res?.title)
          .setThumbnail(res?.thumbnail)
          .setColor(0x4A6FC3)
          .addFields(res?.variants?.map(variant => ({
            name: variant?.title,
            value: `
            ==== Variant id ====
            ${variant?.id}
            
            ==== SKU ====
            ${variant?.sku}
            
            ==== Price ====
            ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD' }).format(variant?.price / 100)}
            
            ==== Availability ====
            ${res?.available ? '✅ AVAILABLE' : '❌ NOT AVAILABLE'}
            `,
            inline: false
          })))

        return embed;
      })

      embeds?.forEach(embedMessage => {
        message.channel.send(embedMessage)
      })

    } catch (err) {
      message.reply(`Sorry, we couldn't process your link${links?.length && links?.length > 1 ? 's' : ''}`)
      message.reply(err)
    }
  }
}