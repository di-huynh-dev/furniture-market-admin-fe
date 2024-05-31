/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingComponent from '@/components/Loading/LoadingComponent'
import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { WithdrawType } from '@/types/transaction.type'
import { formatPrice } from '@/utils/helpers'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Popconfirm, Tag, Tabs } from 'antd'
import { CircleOff, SquareCheckBig } from 'lucide-react'
import DataTable, { TableColumn } from 'react-data-table-component'
import toast from 'react-hot-toast'
import { useState } from 'react'

const WithdrawManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('PROCESSING')

  const { data: transactions, isLoading } = useQuery({
    queryKey: [query_keys.WITHDRAW],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/admin/withdrawal')
      return resp.data.data
    },
  })

  console.log(transactions)

  const updateWithdrawStatus = async (id: string, status: string) => {
    try {
      const resp = await axiosPrivate.put(`/admin/withdrawal/status/${id}`, { status })
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        queryClient.invalidateQueries({ queryKey: [query_keys.WITHDRAW] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const columns: TableColumn<WithdrawType>[] = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Thông tin Tài khoản',
      cell: (row) => (
        <div className="flex flex-col">
          <div>STK: {row.accountNumber}</div>
          <p>Tên ngân hàng: {row.bankName}</p>
          <p>Chủ thẻ: {row.ownerName}</p>
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Giá trị',
      cell: (row) => formatPrice(row.value),
    },
    {
      name: 'Thời gian tạo',
      cell: (row) => row.createdAt,
    },
    {
      name: 'Cập nhật',
      cell: (row) => row.updatedAt,
    },
    {
      name: 'Trạng thái',
      cell: (row) =>
        row.status === 'PROCESSING' ? (
          <Tag color="blue">Đang xử lý</Tag>
        ) : row.status === 'FAIL' ? (
          <Tag color="red">Thất bại</Tag>
        ) : (
          <Tag color="green">Đã xử lý</Tag>
        ),
    },
    {
      name: 'Thao tác',
      cell: (row) => (
        <div className="flex gap-2 items-center text-gray-500">
          <Popconfirm
            title="Cập nhật trạng thái"
            description="Bạn chắc chắn thay đổi trạng thái giao dịch này?"
            onConfirm={() => updateWithdrawStatus(row.id, 'DONE')}
            okText="Yes"
            cancelText="No"
          >
            <SquareCheckBig className="w-5 h-5" />
          </Popconfirm>
          <Popconfirm
            title="Giao dịch thất bại"
            description="Bạn chắc chắn thay đổi trạng thái giao dịch này?"
            onConfirm={() => updateWithdrawStatus(row.id, 'FAIL')}
            okText="Yes"
            cancelText="No"
          >
            <CircleOff className="w-5 h-5" />
          </Popconfirm>
        </div>
      ),
    },
  ]

  const filteredTransactions = transactions?.filter((transaction: WithdrawType) => transaction.status === activeTab)

  if (isLoading) return <LoadingComponent />

  return (
    <div>
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <div className="px-2">
            <Tabs defaultActiveKey="PROCESSING" onChange={(key) => setActiveTab(key)}>
              <Tabs.TabPane tab="Chờ xử lý" key="PROCESSING">
                <DataTable
                  title="Danh sách yêu cầu rút tiền"
                  columns={columns}
                  data={filteredTransactions}
                  pagination
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Đã xử lý" key="DONE">
                <DataTable
                  title="Danh sách yêu cầu rút tiền"
                  columns={columns}
                  data={filteredTransactions}
                  pagination
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Thất bại" key="FAIL">
                <DataTable
                  title="Danh sách yêu cầu rút tiền"
                  columns={columns}
                  data={filteredTransactions}
                  pagination
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WithdrawManagement
