/* eslint-disable @typescript-eslint/no-explicit-any */
import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { OrderItem, ResponseItem } from '@/types/order.type'
import { formatPrice } from '@/utils/helpers'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Popconfirm, Tag } from 'antd'
import DataTable, { TableColumn } from 'react-data-table-component'
import toast from 'react-hot-toast'

const OrderManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const { data: orders, isLoading } = useQuery({
    queryKey: [query_keys.ORDER_LIST],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/admin/order')
      return resp.data.data
    },
  })

  const updateOrderStatus = async (row: OrderItem) => {
    try {
      let status: string = ''
      switch (row.status) {
        case 'TO_SHIP':
          status = 'SHIPPING'
          break
        case 'SHIPPING':
          status = 'COMPLETED'
          break
        default:
          break
      }
      const resp = await axiosPrivate.patch(`/admin/order/status`, {
        orderId: row.id,
        status: status,
      })

      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        queryClient.invalidateQueries({ queryKey: [query_keys.ORDER_LIST] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const columns: TableColumn<OrderItem>[] = [
    { name: 'Mã đơn', selector: (row) => row.id },
    {
      name: 'Danh sách sản phẩm',
      cell: (row) => (
        <div>
          {row.responses.map((item: ResponseItem) => (
            <p>{item.productName}</p>
          ))}
        </div>
      ),
    },
    {
      name: 'Trạng thái',
      cell: (row) =>
        row.status === 'TO_SHIP' ? (
          <Tag color="orange">Chờ vận chuyển</Tag>
        ) : row.status === 'SHIPPING' ? (
          <Tag color="blue">Đang giao</Tag>
        ) : row.status === 'CANCELLED' ? (
          <Tag color="red">Đã hủy</Tag>
        ) : (
          <Tag color="green">Đã giao</Tag>
        ),
    },
    { name: 'Tổng', selector: (row) => formatPrice(row.total) },
    {
      name: 'Thao tác',
      cell: (row) => (
        <div className="flex gap-2 items-center text-gray-500">
          <Popconfirm
            title="Cập nhật trạng thái"
            description="Bạn chắc chắn thay đổi trạng thái đơn hàng này?"
            onConfirm={() => updateOrderStatus(row)}
            okText="Yes"
            cancelText="No"
          >
            <Button>Thay đôi trạng thái</Button>
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
          <DataTable title="Danh sách đơn hàng hệ thống" columns={columns} data={orders} pagination />
        </div>
      </div>
    </div>
  )
}

export default OrderManagement
