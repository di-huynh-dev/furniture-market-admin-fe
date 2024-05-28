export type ReturnOrderType = {
  id: string
  reason: string
  done: boolean
  images: string[]
  orderRefundResponse: {
    id: string
    reason: string
    createdAt: string
    images: string[]
    accepted: boolean
    orderId: string
  }
}
