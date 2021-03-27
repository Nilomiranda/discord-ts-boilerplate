const urlRegex: RegExp = /(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/gim

export const isUrl = (url: string): boolean => {
  if (!url) {
    return false
  }

  return !!url.match(urlRegex)?.length
}

export const extractUrls = (message: string): string[] => {
  if (!message) {
    return []
  }

  return message.match(urlRegex) || []
}
