import * as Discord from 'discord.js'
import {extractUrls, isUrl} from "./common/identifyUrl";
import { JSDOM } from 'jsdom'

const getLinks = (content: string): string[] => {
  return extractUrls(content)
}

const processLinks = (links: string[]): Promise<any> => {
  return new Promise<any>(async (resolve, reject) => {
    if (!links?.length) {
      reject('Please load at least one link')
    }

    let productInformationFromLinks:any[] = []
    const lastLinkIndex = links.length - 1;

    for (let index = 0; index < links.length; index++) {
      let link = links[index];

      // skip iteration if link is not a valid url
      if (!isUrl(link)) {
        continue
      }

      const dom = await JSDOM.fromURL(link);

      if (dom) {
        const serializedDOM = dom?.serialize()

        if (serializedDOM) {
          const nodeWindow = new JSDOM().window
          const domParser = new nodeWindow.DOMParser()
          const parsedHTMLContent = domParser.parseFromString(serializedDOM, 'text/html');
          const scriptTag = parsedHTMLContent.querySelector('script[id="ProductJson--product-template"]')
          const productInformation = JSON.parse(scriptTag.textContent)
          productInformationFromLinks.push(productInformation)
          if (index >= lastLinkIndex) {
            resolve(productInformationFromLinks)
          }
        }
      }
    }
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