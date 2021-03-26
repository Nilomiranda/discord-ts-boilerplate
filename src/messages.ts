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
    shoePalace: links.filter(link => link?.includes(SHOE_PALACE)),
    shopNiceKicks: links.filter(link => link?.includes(SHOP_NICE_KICKS)),
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
  console.log({ productInformation })
  if (!productInformation?.length) {
    return null;
  }

  if (marketplace === SHOE_PALACE) {
    const mappedInformation = productInformation?.map(productInfo => ({ name: 'Title', value: productInfo.title, inline: true }))

    console.log({ mappedInformation })
    return mappedInformation;
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
      const response = await processLinks(links)
      // message.reply(response)
      const embed = new MessageEmbed()
        .setTitle('Response')
        .setColor(0x4A6FC3)
        .addFields(response)

      message.channel.send(embed)
    } catch (err) {
      message.reply(err)
    }
  }
}