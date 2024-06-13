export type ProductDetailType = {
  id: string
  name: string
  onSale: boolean
  price: number
  salePrice: number
  description: string
  size: string
  weight: number
  height: number
  length: number
  width: number
  material: string
  sold: number
  inStock: number
  featured: boolean
  used: boolean
  hidden: boolean
  categoryName: string
  thumbnail: string
  reviewAmount: number
  totalReviewPoint: number
  onDisplay: boolean
  images: string[]
  storeCategories: string[]
  storeInfo?: StoreInfo
}

export type StoreInfo = {
  address: string
  avgReviewStar: string
  id: string
  logo: string
  numReview: number
  productAmount: number
  shopName: string
}
