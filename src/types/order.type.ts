export type OrderItem = {
  id: string
  responses: ResponseItem[]
  status: string
  total: number
  storeInfo: {
    id: string
    logo: string
    name: string
  }
}

export type ResponseItem = {
  id: string
  productMaterial: string
  productId: string
  productName: string
  productPrice: number
  productSize: string
  productThumbnail: string
  quantity: number
  total: number
}
