/* eslint-disable @typescript-eslint/no-explicit-any */
import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { CategoryType } from '@/types/category.type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { AiFillDelete, AiFillEdit, AiOutlineEye, AiOutlineSearch } from 'react-icons/ai'
import { Input, Button, Modal, Form, Upload, Popconfirm } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import type { SearchProps } from 'antd/es/input/Search'
import toast from 'react-hot-toast'
import LoadingComponent from '@/components/Loading/LoadingComponent'
const { Search } = Input

const CategoryManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null)

  const showAddModal = () => {
    setIsAddModalOpen(true)
  }

  const showEditModal = (category: CategoryType) => {
    setCurrentCategory(category)
    setIsEditModalOpen(true)
  }

  const showViewModal = (category: CategoryType) => {
    setCurrentCategory(category)
    setIsViewModalOpen(true)
  }

  const {
    data: categoryList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [query_keys.CATEGORY_LIST],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/admin/category')
      return resp.data.data
    },
  })

  const deleteCategory = async (id: string) => {
    try {
      const resp = await axiosPrivate.delete(`/admin/category/${id}`)
      if (resp.status === 200) {
        queryClient.invalidateQueries({ queryKey: [query_keys.CATEGORY_LIST] })
        toast.success(resp.data.messages[0])
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const [filterText, setFilterText] = useState('')

  const filteredItems = categoryList?.filter(
    (item: CategoryType) => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
  )

  const onSearch: SearchProps['onSearch'] = (value) => {
    setFilterText(value)
  }

  const subHeaderComponentMemo = useMemo(
    () => (
      <div className="flex gap-2 items-center">
        <Search
          placeholder="Nhập tên danh mục..."
          allowClear
          enterButton={<AiOutlineSearch />}
          size="large"
          onSearch={onSearch}
        />
        <Button onClick={showAddModal} type="primary">
          + Thêm danh mục
        </Button>
      </div>
    ),
    [filterText],
  )

  const columns: TableColumn<CategoryType>[] = [
    {
      name: 'Mã danh mục',
      selector: (row) => row.id,
    },
    {
      name: 'Thumbnail',
      cell: (row) => <img src={row.image} alt={row.name} className="w-20 h-16 my-2" />,
    },
    {
      name: 'Tên danh mục',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Thao tác',
      cell: (row) => (
        <div className="flex gap-2 items-center text-gray-500">
          <button className="btn btn-primary" onClick={() => showViewModal(row)}>
            <AiOutlineEye className="w-5 h-5" />
          </button>
          <button className="btn btn-secondary" onClick={() => showEditModal(row)}>
            <AiFillEdit className="w-5 h-5" />
          </button>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn chắc chắn xóa danh mục này?"
            onConfirm={() => deleteCategory(row.id)}
            okText="Yes"
            cancelText="No"
          >
            <AiFillDelete className="w-5 h-5" />
          </Popconfirm>
        </div>
      ),
    },
  ]

  const handleUploadChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'done') {
      toast.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === 'error') {
      toast.error(`${info.file.name} file upload failed.`)
    }
  }

  const handleAddFinish = async (values: { name: string; image: { file: File } }) => {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('image', values.image.file)
      const resp = await axiosPrivate.post('/admin/category', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (resp.status === 200) {
        setIsAddModalOpen(false)
        queryClient.invalidateQueries({ queryKey: [query_keys.CATEGORY_LIST] })
        toast.success(resp.data.messages[0])
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const handleAddFinishFailed = () => {
    toast.error('Vui lòng điền đầy đủ các thông tin!')
  }

  const handleEditFinish = async (values: { name: string; image?: { file: File } }) => {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      if (values.image) {
        formData.append('image', values.image.file)
      }
      const resp = await axiosPrivate.put(`/admin/category/${currentCategory?.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (resp.status === 200) {
        setIsEditModalOpen(false)
        queryClient.invalidateQueries({ queryKey: [query_keys.CATEGORY_LIST] })
        toast.success(resp.data.messages[0])
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const handleEditFinishFailed = () => {
    toast.error('Vui lòng điền đầy đủ các thông tin!')
  }

  if (isError) return <div>Error loading categories</div>

  return (
    <>
      <Modal
        title="Thêm danh mục"
        open={isAddModalOpen}
        onOk={() => setIsAddModalOpen(false)}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddFinish} onFinishFailed={handleAddFinishFailed} autoComplete="off">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input placeholder="Category Name" />
          </Form.Item>
          <Form.Item name="image" label="Hình ảnh" rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh!' }]}>
            <Upload
              name="image"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleUploadChange}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setIsAddModalOpen(false)}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Xem chi tiết danh mục"
        open={isViewModalOpen}
        onOk={() => setIsViewModalOpen(false)}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
      >
        <div>
          <p>
            <strong>Tên danh mục:</strong> {currentCategory?.name}
          </p>
          <p>
            <strong>Thumbnail:</strong>
            <img
              src={currentCategory?.image}
              alt={currentCategory?.name}
              className="w-full max-h-200 object-cover my-2"
            />
          </p>
        </div>
      </Modal>
      <Modal
        title="Chỉnh sửa danh mục"
        open={isEditModalOpen}
        onOk={() => setIsEditModalOpen(false)}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleEditFinish}
          onFinishFailed={handleEditFinishFailed}
          autoComplete="off"
          initialValues={{ name: currentCategory?.name }}
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Please input the category name!' }]}
          >
            <Input placeholder="Category Name" />
          </Form.Item>
          <Form.Item name="image" label="Hình ảnh">
            <Upload
              name="image"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleUploadChange}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <DataTable
        title={<p className="">Quản lý danh mục hệ thống</p>}
        columns={columns}
        data={filteredItems}
        pagination
        subHeader
        progressComponent={<LoadingComponent />}
        progressPending={isLoading}
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
      />
    </>
  )
}

export default CategoryManagement
