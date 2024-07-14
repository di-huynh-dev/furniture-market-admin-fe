import LoadingComponent from '@/components/Loading/LoadingComponent'
import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { TransactionType } from '@/types/transaction.type'
import { formatPrice } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'

const TransactionManagement = () => {
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    document.title = 'Quản lý giao dịch'
  }, [])

  const { data: transactions, isLoading } = useQuery({
    queryKey: [query_keys.TRANSACTION],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/admin/transaction-history')
      return resp.data.data
    },
  })

  const columns: TableColumn<TransactionType>[] = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Tên người thực hiện',
      cell: (row) => row.ownerName,
      sortable: true,
    },

    {
      name: 'Loại giao dịch',
      cell: (row) =>
        row.type === 'CHARGE' ? (
          <div className="flex gap-1 items-center">
            <p>Nạp</p>
          </div>
        ) : row.type === 'ORDER_INCOME' ? (
          <div className="flex gap-1 items-center">
            <p>Lợi nhuận đơn hàng</p>
          </div>
        ) : (
          <div className="flex gap-1 items-center">
            <p>Rút</p>
          </div>
        ),
    },
    {
      name: 'Giá trị',
      cell: (row) =>
        row.type === 'CHARGE' || row.type === 'ORDER_INCOME' ? (
          <p className="text-green-500">{formatPrice(row.value)}</p>
        ) : (
          <p className="text-red-500">{formatPrice(row.value * -1)}</p>
        ),
    },
    {
      name: 'Thời gian',
      cell: (row) => row.createdAt,
    },
  ]

  return (
    <div>
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <DataTable
            title="Danh sách lịch sử giao dịch hệ thống"
            columns={columns}
            data={transactions}
            progressPending={isLoading}
            progressComponent={<LoadingComponent />}
            pagination
          />
        </div>
      </div>
    </div>
  )
}

export default TransactionManagement
