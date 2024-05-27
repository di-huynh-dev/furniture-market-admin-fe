/* eslint-disable @typescript-eslint/no-explicit-any */
import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { WithdrawType } from '@/types/transaction.type'
import { formatDate, formatPrice } from '@/utils/helpers'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Popconfirm, Tag } from 'antd'
import { CircleOff, SquareCheckBig } from 'lucide-react'
import DataTable, { TableColumn } from 'react-data-table-component'
import toast from 'react-hot-toast'

const WithdrawManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const { data: transactions, isLoading } = useQuery({
    queryKey: [query_keys.WITHDRAW],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/admin/withdrawal')
      return resp.data.data
    },
  })

  const updateWithdrawStatus = async (id: string) => {
    try {
      const resp = await axiosPrivate.put(`/admin/withdrawal/status/${id}`, {
        status: 'DONE',
      })
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
      cell: (row) => formatDate(row.createdAt),
    },
    {
      name: 'Cập nhật',
      cell: (row) => formatDate(row.updatedAt),
    },
    {
      name: 'Trạng thái',
      cell: (row) =>
        row.status === 'PROCESSING' ? <Tag color="blue">Đang xử lý</Tag> : <Tag color="green">Đã xử lý</Tag>,
    },

    {
      name: 'Thao tác',
      cell: (row) => (
        <div className="flex gap-2 items-center text-gray-500">
          <Popconfirm
            title="Cập nhật trạng thái"
            description="Bạn chắc chắn thay đổi trạng thái giao dịch này?"
            onConfirm={() => updateWithdrawStatus(row.id)}
            okText="Yes"
            cancelText="No"
          >
            <SquareCheckBig />
          </Popconfirm>
          <Popconfirm
            title="Giao dịch thất bại"
            description="Bạn chắc chắn thay đổi trạng thái giao dịch này?"
            onConfirm={() => updateWithdrawStatus(row.id)}
            okText="Yes"
            cancelText="No"
          >
            <CircleOff />
          </Popconfirm>
        </div>
      ),
    },
  ]

  if (isLoading) return <div>Loading...</div>
  return (
    <div>
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <DataTable title="Danh sách yêu cầu rút tiền" columns={columns} data={transactions} pagination />
        </div>
      </div>
    </div>
  )
}

export default WithdrawManagement
