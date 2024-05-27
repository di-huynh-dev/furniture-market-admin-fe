export type StatisticType = {
  numOfBuyer: number
  numOfOrderByMonth: number
  numOfStore: number
  orderIncome: number
  orderByDays: OrderStatisticType[]
  incomeByDays: StatisticIncomeType[]
  marketing: {
    income: number
    incomeByDate: StatisticIncomeType[]
  }
  orderByDate: StatisticIncomeType[]
}

export type OrderStatisticType = {
  date: string
  amount: number
}
export type StatisticIncomeType = {
  date: string
  incomeByDay: number
}
