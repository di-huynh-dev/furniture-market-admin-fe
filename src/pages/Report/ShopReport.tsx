/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingComponent from '@/components/Loading/LoadingComponent'
import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ReportedType } from '@/types/reported.type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Badge, Button, Drawer, Popconfirm, Tag } from 'antd'
import { useEffect, useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import toast from 'react-hot-toast'
import { AiOutlineEye, AiFillAlert } from 'react-icons/ai'

const ShopReport = () => {
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()
  const [selectedRow, setSelectedRow] = useState('')
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentReport, setCurrentReport] = useState<ReportedType | null>(null)

  useEffect(() => {
    document.title = 'Báo cáo cửa hàng'
  }, [])

  const { data: reportedProducts, isLoading } = useQuery({
    queryKey: [query_keys.REPORTED_PRODUCT_LIST, 'store'],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/admin/report')
      return resp.data.data
    },
  })

  const filteredProducts = reportedProducts?.filter((product: ReportedType) => product.type === 'STORE_REPORT')
  console.log(filteredProducts)

  const showReportDetails = (report: ReportedType) => {
    setCurrentReport(report)
    setIsViewModalOpen(true)
  }

  const handleRequestExecute = async (status: string) => {
    try {
      const resp = await axiosPrivate.put(`/admin/report/status/${selectedRow}`, { status })
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        client.invalidateQueries({ queryKey: [query_keys.REPORTED_PRODUCT_LIST, 'store'] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const handleAcceptExplain = async (id: string) => {
    try {
      const resp = await axiosPrivate.put(`/admin/report/explanation/${id}`)
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        client.invalidateQueries({ queryKey: [query_keys.REPORTED_PRODUCT_LIST, 'store'] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const columns: TableColumn<ReportedType>[] = [
    {
      name: 'Thông tin shop',
      cell: (row) => (
        <div>
          <div>ID: {row.objectInfo.id}</div>
          <p>Tên: {row.objectInfo.storeName}</p>
          <img src={row.objectInfo.logo} alt="" className="w-10 h-10 object-cover gap-2" />
        </div>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: 'Lý do',
      cell: (row) => row.reason,
      sortable: true,
    },

    {
      name: 'Mô tả thêm',
      cell: (row) => row.description,
    },

    {
      name: 'Giải trình',
      cell: (row) =>
        row.explanations.length > 0 ? <Tag color="blue">Đã giải trình</Tag> : <Tag color="red">Chưa giải trình</Tag>,
    },
    {
      name: 'Tình trạng',
      cell: (row) => (
        <Badge
          status={
            row.status === 'PENDING'
              ? 'warning'
              : row.status === 'PROCESSING'
              ? 'processing'
              : row.status === 'UNACCEPTED'
              ? 'success'
              : 'error'
          }
          text={
            row.status === 'PENDING'
              ? 'Chưa xử lý'
              : row.status === 'PROCESSING'
              ? 'Đang xử lý'
              : row.status === 'UNACCEPTED'
              ? 'Không vi phạm'
              : 'Vi phạm'
          }
        />
      ),
    },
    {
      name: 'Thao tác',
      cell: (row) => (
        <div className="flex gap-2 items-center">
          <button className="btn btn-primary flex gap-1" onClick={() => showReportDetails(row)}>
            <AiOutlineEye className="w-5 h-5 text-gray-500" />
          </button>
          <Popconfirm
            title="Yêu cầu giải trình"
            description="Bạn muốn yêu cầu shop giải trình vi phạm này?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              setSelectedRow(row.id)
              handleRequestExecute('PROCESSING')
            }}
          >
            <AiFillAlert className="w-5 h-5 text-gray-500" />
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div>
      <Drawer onClose={() => setIsViewModalOpen(false)} open={isViewModalOpen}>
        {currentReport && (
          <div className="space-y-4">
            <p className="font-bold text-center text-lg">Thông tin báo cáo cửa hàng vi phạm</p>
            <p>ID cửa hàng: {currentReport.objectInfo.id}</p>
            <p>Tên cửa hàng: {currentReport.objectInfo.storeName}</p>
            <p>Lý do: {currentReport.reason}</p>
            <p>Mô tả thêm: {currentReport.description}</p>
            <p>
              Trạng thái:
              {currentReport.status === 'DONE'
                ? ' Đã xử lý'
                : currentReport.status === 'PROCESSING'
                ? ' Đang xử lý'
                : ' Chờ xử lý'}
            </p>
            <div>Thông tin giải trình của shop: {currentReport.explanations?.map((exp) => exp.description)}</div>
            <div className="grid grid-cols-2 gap-2">
              {currentReport.explanations?.map((exp) =>
                exp.images.map((img) => <img src={img} alt="" className="w-full" key={img} />),
              )}
            </div>
            {currentReport.status === 'PROCESSING' && currentReport.explanations.length > 0 && (
              <div className="flex gap-2 my-2">
                <Button
                  onClick={() => {
                    handleAcceptExplain(currentReport.explanations[0].id)
                    setSelectedRow(currentReport.id)
                    handleRequestExecute('UNACCEPTED')
                  }}
                  type="primary"
                >
                  Chấp nhận
                </Button>
                <Button
                  onClick={() => {
                    setSelectedRow(currentReport.id)
                    handleRequestExecute('ACCEPTED')
                  }}
                >
                  Từ chối
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <DataTable
            title="Danh sách báo cáo các shop vi phạm"
            columns={columns}
            data={filteredProducts}
            progressPending={isLoading}
            progressComponent={<LoadingComponent />}
            pagination
          />
        </div>
      </div>
    </div>
  )
}

export default ShopReport
