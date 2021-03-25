import * as Discord from 'discord.js'
import {extractUrls} from "./common/identifyUrl";
import { JSDOM } from 'jsdom'

const getLinks = (content: string): string[] => {
  return extractUrls(content)
}

const processLinks = (links: string[]): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    if (!links?.length) {
      reject('Please load at least one link')
    }

    JSDOM.fromURL(links[0]).then(dom => {
      const serializedDOM = dom?.serialize()

      if (serializedDOM) {
        const nodeWindow = new JSDOM().window
        const domParser = new nodeWindow.DOMParser()
        const parsedHTMLContent = domParser.parseFromString(serializedDOM, 'text/html');
        const scriptTag = parsedHTMLContent.querySelector('script[id="ProductJson--product-template"]')
        const productInformation = JSON.parse(scriptTag.textContent)
        resolve(productInformation)
      }
    })
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
      message.reply(res?.variants)
    }).catch(err => {
      message.reply(err)
    })
  }
}