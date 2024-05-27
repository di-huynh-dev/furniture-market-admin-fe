/* eslint-disable @typescript-eslint/no-explicit-any */
import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ReportedType } from '@/types/reported.type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Badge, Button, Drawer, Popconfirm, Tag } from 'antd'
import { useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import toast from 'react-hot-toast'
import { AiOutlineEye, AiFillAlert } from 'react-icons/ai'

const ProductReport = () => {
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()
  const [selectedRow, setSelectedRow] = useState('')
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentReport, setCurrentReport] = useState<ReportedType | null>(null)

  const { data: reportedProducts, isLoading } = useQuery({
    queryKey: [query_keys.REPORTED_PRODUCT_LIST],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/admin/report')
      return resp.data.data
    },
  })

  const showReportDetails = (report: ReportedType) => {
    setCurrentReport(report)
    setIsViewModalOpen(true)
  }

  const handleRequestExecute = async (status: string) => {
    try {
      const resp = await axiosPrivate.put(`/admin/report/status/${selectedRow}`, { status })
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        client.invalidateQueries({ queryKey: [query_keys.REPORTED_PRODUCT_LIST] })
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
        client.invalidateQueries({ queryKey: [query_keys.REPORTED_PRODUCT_LIST] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const columns: TableColumn<ReportedType>[] = [
    {
      name: 'Tên sản phẩm',
      selector: (row) => row.objectInfo.name,
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
      name: 'Tình trạng',
      cell: (row) => (
        <Badge
          status={
            row.status === 'PENDING'
              ? 'warning'
              : row.status === 'PROCESSING'
              ? 'processing'
              : row.status === 'DONE'
              ? 'success'
              : 'error'
          }
          text={
            row.status === 'PENDING'
              ? 'Chưa xử lý'
              : row.status === 'PROCESSING'
              ? 'Đang xử lý'
              : row.status === 'DONE'
              ? 'Đã xử lý'
              : 'Từ chối'
          }
        />
      ),
    },
    {
      name: 'Giải trình',
      cell: (row) =>
        row.explanations.length > 0 ? <Tag color="blue">Đã giải trình</Tag> : <Tag color="red">Chưa giải trình</Tag>,
    },
    {
      name: 'Thao tác',
      cell: (row) => (
        <div className="flex gap-2 items-center">
          <button className="btn btn-primary flex gap-1" onClick={() => showReportDetails(row)}>
            <AiOutlineEye className="w-5 h-5" />
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
            <AiFillAlert className="w-5 h-5 text-yellow-500" />
          </Popconfirm>
        </div>
      ),
    },
  ]
  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <Drawer onClose={() => setIsViewModalOpen(false)} open={isViewModalOpen}>
        {currentReport && (
          <div className="space-y-4">
            <p className="font-bold text-center text-lg">Thông tin báo cáo vi phạm sản phẩm</p>
            <p>Tên sản phẩm: {currentReport.objectInfo.name}</p>
            <p>Lý do: {currentReport.reason}</p>
            <p>Mô tả thêm: {currentReport.description}</p>
            <p>
              Trạng thái :
              {currentReport.status === 'DONE'
                ? 'Đã xử lý'
                : currentReport.status === 'PROCESSING'
                ? 'Đang xử lý'
                : 'Chờ xử lý'}
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
                    handleRequestExecute('DONE')
                  }}
                  type="primary"
                >
                  Chấp nhận
                </Button>
                <Button
                  onClick={() => {
                    setSelectedRow(currentReport.id)
                    handleRequestExecute('DONE')
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
          <DataTable title="Danh sách sản phẩm vi phạm" columns={columns} data={reportedProducts} pagination />
        </div>
      </div>
    </div>
  )
}

export default ProductReport
