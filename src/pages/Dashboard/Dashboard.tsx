import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Select } from 'antd'
import { FaMoneyBillTrendUp, FaShop, FaUser } from 'react-icons/fa6'
import { RiBillFill } from 'react-icons/ri'
import { formatPrice } from '@/utils/helpers'
import IncomeLineChart from './components/IncomeLineChart'
import OrderBarChart from './components/OrderBarChart'
import LoadingComponent from '@/components/Loading/LoadingComponent'
import MarketingIncomeLineChart from './components/MarketingIncomeLineChart'

const Dashboard = () => {
  const axiosPrivate = useAxiosPrivate()
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(currentYear)

  const {
    data: statistics,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [query_keys.STATISTIC],
    queryFn: async () => {
      const resp = await axiosPrivate.get(`admin/statistic?month=${month}&year=${year}`)
      return resp.data.data
    },
  })

  const handleMonthChange = (value: string) => {
    setMonth(parseInt(value))
  }

  const handleYearChange = (value: string) => {
    setYear(parseInt(value))
  }

  useEffect(() => {
    refetch()
  }, [month, year, refetch])

  const getMonthOptions = () => {
    return [
      { value: '1', label: 'Tháng 1' },
      { value: '2', label: 'Tháng 2' },
      { value: '3', label: 'Tháng 3' },
      { value: '4', label: 'Tháng 4' },
      { value: '5', label: 'Tháng 5' },
      { value: '6', label: 'Tháng 6' },
      { value: '7', label: 'Tháng 7' },
      { value: '8', label: 'Tháng 8' },
      { value: '9', label: 'Tháng 9' },
      { value: '10', label: 'Tháng 10' },
      { value: '11', label: 'Tháng 11' },
      { value: '12', label: 'Tháng 12' },
    ]
  }

  const getYearOptions = () => {
    return Array.from({ length: 2 }, (_, i) => currentYear - i).map((y) => ({ value: y.toString(), label: `Năm ${y}` }))
  }

  if (isLoading) return <LoadingComponent />

  return (
    <div>
      <div className="pb-5 lg:text-lg text-sm">
        <div className="grid md:grid-cols-2">
          <div>
            <div className="font-bold capitalize">Tổng quan hệ thống</div>
          </div>
          <div className="flex gap-2">
            <Select
              defaultValue={month.toString()}
              style={{ width: 120 }}
              onChange={handleMonthChange}
              options={getMonthOptions()}
            />
            <Select
              defaultValue={year.toString()}
              style={{ width: 120 }}
              onChange={handleYearChange}
              options={getYearOptions()}
            />
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-2">
        <div className="card shadow-lg items-center gap-2 grid grid-cols-2  bg-white px-6 py-4">
          <div>
            <p className="font-bold">Hoa hồng đơn hàng</p>
            <p className="md:text-2xl text-lg">{formatPrice(statistics?.orderIncome)}</p>
          </div>
          <div className="flex justify-end">
            <FaMoneyBillTrendUp className="md:h-20 w-16 h-16 text-yellow-500" />
          </div>
        </div>
        <div className="card shadow-lg items-center gap-2 grid grid-cols-2  bg-white px-6 py-4">
          <div>
            <p className="font-bold">Tổng số đơn hàng</p>
            <p className="md:text-2xl text-lg">{statistics?.numOfOrderByMonth}</p>
          </div>
          <div className="flex justify-end">
            <RiBillFill className="md:h-20 w-16 h-16 text-red-500" />
          </div>
        </div>

        <div className="card shadow-lg items-center gap-2 grid grid-cols-2  bg-white px-6 py-4">
          <div>
            <p className="font-bold">Tổng số người mua</p>
            <p className="md:text-2xl text-lg">{statistics?.numOfBuyer}</p>
          </div>
          <div className="flex justify-end">
            <FaUser className="md:h-20 w-16 h-16 text-blue-500" />
          </div>
        </div>
        <div className="card shadow-lg items-center gap-2 grid grid-cols-2  bg-white px-6 py-4">
          <div>
            <p className="font-bold">Tổng số cửa hàng</p>
            <p className="md:text-2xl text-lg">{statistics?.numOfStore}</p>
          </div>
          <div className="flex justify-end">
            <FaShop className="md:h-20 w-16 h-16 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="rounded-md border w-full py-4 justify-center bg-white my-2">
        <IncomeLineChart data={statistics} />
      </div>
      <div className="rounded-md border w-full py-4 justify-center bg-white my-2">
        <MarketingIncomeLineChart data={statistics} />
      </div>
      <div className="rounded-md border w-full py-4 justify-center bg-white my-2">
        <OrderBarChart data={statistics} />
      </div>
    </div>
  )
}

export default Dashboard
