/* eslint-disable @typescript-eslint/no-explicit-any */
import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ReturnOrderType } from '@/types/refund.type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { TabsProps } from 'antd'
import { Button, Drawer, Popconfirm, Tabs, Tag } from 'antd'
import { useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import toast from 'react-hot-toast'
import { AiOutlineEye } from 'react-icons/ai'

const ReturnOrderManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const [status, setStatus] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentRefundReport, setCurrentRefundReport] = useState<ReturnOrderType | null>(null)
  const onChange = () => {
    setStatus(!status)
  }

  const { data, isLoading } = useQuery({
    queryKey: [query_keys.REFUND_ORDER, status],
    queryFn: async () => {
      const resp = await axiosPrivate.get(`/admin/refund-complaint/by-done?done=${status}`)
      return resp.data.data
    },
  })
  console.log(data)

  const handleAccessRefund = async (id: string, status: boolean) => {
    try {
      const resp = await axiosPrivate.put(`/admin/order-refund/accepted/${id}?accepted=${status}`)
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        queryClient.invalidateQueries({ queryKey: [query_keys.REFUND_ORDER] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const showUserDetails = (item: ReturnOrderType) => {
    setCurrentRefundReport(item)
    setIsViewModalOpen(true)
  }

  const columns: TableColumn<ReturnOrderType>[] = [
    { name: 'ID', selector: (row) => row.id },
    { name: 'Nội dung giải trình', cell: (row) => row.reason },
    {
      name: 'Mã đơn hàng',
      cell: (row) => row.orderRefundResponse.orderId,
    },
    {
      name: 'Trạng thái',
      cell: (row) => <Tag color={row.done ? 'green' : 'red'}>{row.done ? 'Đã xử lý' : 'Chưa xử lý'}</Tag>,
    },
    {
      name: 'Chấp nhận ',
      cell: (row) => (
        <Tag color={row.orderRefundResponse.accepted ? 'green' : 'red'}>
          {row.orderRefundResponse.accepted ? 'Đồng ý' : 'Từ chối'}
        </Tag>
      ),
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="flex gap-1 items-center text-gray-500">
          <button className="btn btn-primary" onClick={() => showUserDetails(row)}>
            <AiOutlineEye className="w-5 h-5" />
          </button>
          <Popconfirm
            title="Xác nhận đồng ý hoàn tiền đơn hàng?"
            description="Bạn chắc chắn đồng ý hoàn tiền đơn hàng này?"
            onConfirm={() => handleAccessRefund(row.orderRefundResponse.id, true)}
            okText="Yes"
            cancelText="No"
          >
            <Button>Hoàn đơn</Button>
          </Popconfirm>
          <Popconfirm
            title="Xác nhận từ chối hoàn tiền đơn hàng?"
            description="Bạn chắc chắn từ chối hoàn tiền đơn hàngnày?"
            onConfirm={() => handleAccessRefund(row.orderRefundResponse.id, false)}
            okText="Yes"
            cancelText="No"
          >
            <Button>Từ chối</Button>
          </Popconfirm>
        </div>
      ),
    },
  ]
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Chưa xử lý',
      children: (
        <>
          <DataTable
            title="Danh sách yêu cầu hoàn trả đã xử lý"
            columns={columns}
            data={data}
            pagination
            progressPending={isLoading}
          />
        </>
      ),
    },
    {
      key: '2',
      label: 'Đã xử lý',
      children: (
        <>
          <DataTable
            title="Danh sách yêu cầu hoàn trả chưa xử lý"
            columns={columns}
            data={data}
            pagination
            progressPending={isLoading}
          />
        </>
      ),
    },
  ]
  return (
    <div>
      <Drawer width={500} loading={isLoading} onClose={() => setIsViewModalOpen(false)} open={isViewModalOpen}>
        {currentRefundReport && (
          <>
            <div>
              <p className="text-lg font-bold">Thông tin về yêu cầu hoàn đơn phía người dùng:</p>
              <div className="flex gap-2 items-center">
                <p className="font-bold">ID:</p>
                <p>{currentRefundReport.orderRefundResponse.id}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="font-bold">Mã đơn:</p>
                <p>{currentRefundReport.orderRefundResponse.orderId}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="font-bold">Lý do hoàn trả:</p>
                <p>{currentRefundReport.orderRefundResponse.reason}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="font-bold">Thời gian:</p>
                <p>{currentRefundReport.orderRefundResponse.createdAt}</p>
              </div>
              <div className="">
                <p className="font-bold">Hình ảnh:</p>

                {currentRefundReport.orderRefundResponse.images.map((image) => (
                  <img key={image} src={image} className="my-2 object-cover" />
                ))}
              </div>
            </div>
            <div>
              <p className="text-lg font-bold">Thông tin về giải trình từ chối hoàn đơn của shop:</p>
              <div className="flex gap-2 items-center">
                <p className="font-bold">ID:</p>
                <p>{currentRefundReport.id}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="font-bold">Lý do hoàn trả:</p>
                <p>{currentRefundReport.reason}</p>
              </div>
              <div className="">
                <p className="font-bold">Hình ảnh:</p>
                {currentRefundReport.images.map((image) => (
                  <img key={image} src={image} className="my-2 object-cover" />
                ))}
              </div>
            </div>
          </>
        )}
      </Drawer>

      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}

export default ReturnOrderManagement
