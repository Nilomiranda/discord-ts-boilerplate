import { MarketPlaces } from '../common/constants'

export interface Link {
  user_id: string
  link: string
  created_date?: string
  store: MarketPlaces
}
