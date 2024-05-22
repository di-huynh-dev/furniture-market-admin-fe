export type TransactionType = {
  id: number
  type: string
  ownerName: string
  createdAt: string
  value: number
}

export type WithdrawType = {
  id: string
  value: number
  status: string
  accountNumber: string
  bankName: string
  ownerName: string
  createdAt: string
  updatedAt: string
}
