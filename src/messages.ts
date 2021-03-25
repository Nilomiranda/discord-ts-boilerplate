import * as Discord from 'discord.js'
import {extractUrls, isUrl} from "./common/identifyUrl";
import { JSDOM } from 'jsdom'
import {SHOE_PALACE, SHOP_NICE_KICKS} from "./common/constants";

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
  const extractedInformation: any[] = [];
  const lastLinkIndex = links.length - 1;

  return new Promise(async (resolve) => {
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
          console.log({ link, index, lastLinkIndex, willResolve: index >= lastLinkIndex })
          if (index >= lastLinkIndex) {
            resolve(extractedInformation)
          }
        }
      }
    }
  })
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

    resolve([...shoePalaceInformation, ...shopNiceKicksInformation])
  })
}

export const readMessage = (message: Discord.Message) => {
  const { content } = message || {};

  if (!content) {
    return message.reply('Sorry, I cannot understand that');
  }

  if (content.startsWith('!snk load') || content.startsWith('!sp load')) {
    const links: string[] = getLinks(content);
    if (!links?.length) {
      return message.reply('Please, inform at least one link')
    }

    processLinks(links).then(res => {
      console.log(res?.length)
      message.reply(res)
    }).catch(err => {
      message.reply(err)
    })
  }
}