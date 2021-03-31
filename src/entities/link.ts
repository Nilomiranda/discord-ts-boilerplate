import { MarketPlaces } from '../common/constants'
import { BaseEntity } from './base'

export interface LinkEntity extends BaseEntity {
  user_id: string
  link: string
  store: MarketPlaces
}
