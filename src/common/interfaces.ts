export interface ProductMedia {
  alt: string
  id: number
  position: number
  preview_image: {
    aspect_ratio: number
    height: number
    width: number
    src: string
  }
  aspect_ratio: number
  height: number
  media_type: string
  src: string
  width: number
}

export interface ProductVariant {
  id: number
  title: string
  option1: string
  option2: string
  option3: string
  sku: string
  requires_shipping: boolean
  taxable: boolean
  featured_image: string
  available: false
  name: string
  public_title: string
  options: string[]
  price: number
  weight: number
  compare_at_price: number
  inventory_quantity: number
  inventory_management: string
  inventory_policy: string
  barcode: string
}

export interface Product {
  id: number
  title: string
  handle: string
  description: string
  published_at: string
  created_at: string
  vendor: string
  type: string
  tags: string[]
  price: number
  price_min: number
  price_max: number
  available: boolean
  price_varies: boolean
  compare_at_price: number
  compare_at_price_min: number
  compare_at_price_max: number
  compare_at_price_varies: boolean
  variants: ProductVariant[]
  images: string[]
  featured_image: string
  options: string[]
  media: ProductMedia[]
  content: string
}
