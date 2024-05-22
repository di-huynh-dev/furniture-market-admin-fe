import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { TransactionType } from '@/types/transaction.type'
import { formatPrice } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import DataTable, { TableColumn } from 'react-data-table-component'

const TransactionManagement = () => {
  const axiosPrivate = useAxiosPrivate()

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
      cell: (row) => row.type,
    },
    {
      name: 'Giá trị',
      cell: (row) => formatPrice(row.value),
    },
    {
      name: 'Thời gian',
      cell: (row) => row.createdAt,
    },
  ]
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <DataTable title="Danh sách lịch sử giao dịch hệ thống" columns={columns} data={transactions} pagination />
        </div>
      </div>
    </div>
  )
}

export default TransactionManagement
