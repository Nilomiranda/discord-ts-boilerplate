import { Message } from 'discord.js'
import { client } from '../config/database'
import { LinkEntity } from '../entities/link'
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

  const mappedLinks: LinkEntity[] = links?.map((link) => ({ user_id: userId, link, store: identifyStore(link) }))

  try {
    await client('links').insert(mappedLinks)
  } catch (err) {
    console.error('Error inserting links', err)
    throw new Error(err)
  }
}

export const loadLinks = async (message: Message, marketplace: MarketPlaces): Promise<undefined | string[]> => {
  try {
    const res = await client<LinkEntity>('links').select('link').where({
      store: marketplace,
    })

    if (res) {
      return res?.map((linkLoadResponse) => linkLoadResponse.link)
    }
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteLinks = async (message: Message, marketplace: MarketPlaces, links: string[] = []): Promise<boolean> => {
  const { user } = message?.member || { user: null }

  if (!user) {
    return
  }

  const { id } = user

  if (!links?.length) {
    return false
  }

  try {
    const res = await client<LinkEntity>('links').select('link', 'id').whereIn('link', links).andWhere({
      user_id: id,
      store: marketplace,
    })

    if (res) {
      const idsToDelete = res?.map((linkLoadResponse) => linkLoadResponse?.id) || []

      // return res?.map((linkLoadResponse) => linkLoadResponse.link)
      if (idsToDelete?.length) {
        await client<LinkEntity>('links').whereIn('id', idsToDelete).del()
        return true
      }

      return false
    }
  } catch (err) {
    console.error('Error deleting links', err)
    throw new Error(err)
  }
}
