/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingComponent from '@/components/Loading/LoadingComponent'
import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { OrderItem, ResponseItem } from '@/types/order.type'
import { formatPrice } from '@/utils/helpers'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Popconfirm, Tag, Tabs } from 'antd'
import DataTable, { TableColumn } from 'react-data-table-component'
import toast from 'react-hot-toast'
import { useState } from 'react'

const OrderManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('TO_SHIP')

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
    { name: 'Mã đơn', cell: (row) => row.id },
    {
      name: 'Danh sách sản phẩm',
      cell: (row) => (
        <div>
          {row.responses.map((item: ResponseItem) => (
            <p key={item.productId}>{item.productName}</p>
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
            <Button>Cập nhật trạng thái</Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  const filteredOrders = orders?.filter((order: OrderItem) => order.status === activeTab)

  return (
    <div>
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <div className="px-2">
            <Tabs defaultActiveKey="TO_SHIP" onChange={(key) => setActiveTab(key)}>
              <Tabs.TabPane tab="Chờ vận chuyển" key="TO_SHIP">
                <DataTable
                  title="Danh sách đơn hàng chờ vận chuyển"
                  columns={columns}
                  data={filteredOrders}
                  progressComponent={<LoadingComponent />}
                  progressPending={isLoading}
                  pagination
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Đang giao" key="SHIPPING">
                <DataTable title="Danh sách đơn hàng đang giao" columns={columns} data={filteredOrders} pagination />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Đã giao" key="COMPLETED">
                <DataTable title="Danh sách đơn hàng đã giao" columns={columns} data={filteredOrders} pagination />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Đã hủy" key="CANCELLED">
                <DataTable title="Danh sách đơn hàng đã hủy" columns={columns} data={filteredOrders} pagination />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderManagement
