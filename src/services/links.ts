import { Message } from 'discord.js'
import { client } from '../config/database'
import { Link } from '../entities/link'
import { MarketPlaces, SHOE_PALACE, SHOP_NICE_KICKS } from '../common/constants'

const identifyStore = (link: string): MarketPlaces => {
  if (link?.includes(SHOP_NICE_KICKS)) {
    return MarketPlaces.SHOP_NICE_KICKS
  }

  if (link?.includes(SHOE_PALACE)) {
    return MarketPlaces.SHOE_PALACE
  }

  return null
}

export const saveLinks = async (links: string[], message: Message): Promise<void> => {
  const userId = message?.member?.user?.id

  const mappedLinks: Link[] = links?.map((link) => ({ user_id: userId, link, store: identifyStore(link) }))

  try {
    await client('links').insert(mappedLinks)
  } catch (err) {
    console.error('Error inserting links', err)
    throw new Error(err)
  }
}

export const loadLinks = async (message: Message, marketplace: MarketPlaces): Promise<undefined | string[]> => {
  const { user } = message?.member || { user: null }

  if (!user) {
    return
  }

  const { id } = user

  try {
    const res = await client<Link>('links').select('link').where({
      user_id: id,
      store: marketplace,
    })

    if (res) {
      return res?.map((linkLoadResponse) => linkLoadResponse.link)
    }
  } catch (err) {
    throw new Error(err)
  }
}
