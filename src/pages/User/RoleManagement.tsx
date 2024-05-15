/* eslint-disable @typescript-eslint/no-explicit-any */
import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { RegisterType, UserType } from '@/types/user.type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import DataTable, { TableColumn } from 'react-data-table-component'
import { Badge, Popconfirm, Tag, Drawer, Button, Modal, Form, Select } from 'antd'
import { AiFillLock, AiOutlineEye, AiOutlineSearch } from 'react-icons/ai'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import toast from 'react-hot-toast'
import { useMemo, useState } from 'react'
import Input, { SearchProps } from 'antd/es/input'
import Search from 'antd/es/input/Search'

const RoleManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [filterText, setFilterText] = useState('')
  const [form] = Form.useForm()

  const { data: userList, isLoading } = useQuery({
    queryKey: [query_keys.USER_LIST],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/admin/user')
      return resp.data.data
    },
  })

  const allowedRoles = ['ADMIN_ORDER', 'ADMIN_REPORT', 'ADMIN_CS', 'ADMIN_MARKETING']

  const filteredItems = userList?.filter(
    (item: UserType) => allowedRoles.includes(item.role) && item.email.toLowerCase().includes(filterText.toLowerCase()),
  )

  const onSearch: SearchProps['onSearch'] = (value) => {
    setFilterText(value)
  }

  const subHeaderComponentMemo = useMemo(
    () => (
      <div className="flex gap-2 items-center">
        <Search
          placeholder="Nhập email..."
          allowClear
          enterButton={<AiOutlineSearch />}
          size="large"
          onSearch={onSearch}
        />
        <Button onClick={() => setIsAddModalOpen(true)} type="primary">
          + Thêm phân quyền
        </Button>
      </div>
    ),
    [filterText],
  )

  const updateUserStatus = async (id: string) => {
    try {
      const resp = await axiosPrivate.put(`/admin/user/status/${id}`)
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        queryClient.invalidateQueries({ queryKey: [query_keys.USER_LIST] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const showUserDetails = (user: UserType) => {
    setCurrentUser(user)
    setIsViewModalOpen(true)
  }

  const columns: TableColumn<UserType>[] = [
    {
      name: 'ID',
      selector: (row) => row.id,
    },
    {
      name: 'Tên người dùng',
      cell: (row) => (
        <div className="flex gap-2 items-center">
          <img src={row.avatar} alt={row.fullName} className="w-10 rounded-full my-2" />
          <p>{row.fullName}</p>
        </div>
      ),
    },
    {
      name: 'Email (Trạng thái)',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <p>{row.email}</p>
          {row.emailConfirmed ? <Badge color="green" /> : <Badge color="red" />}
        </div>
      ),
    },
    {
      name: 'SĐT',
      selector: (row) => row.phone,
    },
    {
      name: 'Giới tính',
      selector: (row) => row.gender,
    },
    {
      name: 'Trạng thái',
      cell: (row) =>
        row.active ? <Tag color="#87d068">Đang hoạt động</Tag> : <Tag color="#f50">Tạm dừng hoạt động</Tag>,
    },
    {
      name: 'Vai trò',
      selector: (row) => row.role,
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="flex gap-2 items-center text-gray-500">
          <button className="btn btn-primary" onClick={() => showUserDetails(row)}>
            <AiOutlineEye className="w-5 h-5" />
          </button>
          <Popconfirm
            title="Cập nhật trạng thái"
            description="Bạn chắc chắn thay đổi trạng thái hoạt động của người dùng này?"
            onConfirm={() => updateUserStatus(row.id)}
            okText="Yes"
            cancelText="No"
          >
            <button>
              <AiFillLock className="w-5 h-5" />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ]
  const handleGenderChange = (value: string) => {
    form.setFieldsValue({ gender: value })
  }
  const handleRoleChange = (value: string) => {
    form.setFieldsValue({ role: value })
  }

  const handleAddFinish = async (values: RegisterType) => {
    try {
      const formData: RegisterType = {
        email: values.email,
        phone: values.phone,
        role: values.role,
        password: values.password,
        fullName: values.fullName,
        gender: values.gender,
      }
      const resp = await axiosPrivate.post('/auth/create-admin', formData)

      if (resp.status === 200) {
        setIsAddModalOpen(false)
        toast.success(resp.data.messages[0])
        form.resetFields()
        queryClient.invalidateQueries({ queryKey: [query_keys.USER_LIST] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const handleAddFinishFailed = () => {}

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <Modal
        title="Thêm tài khoản"
        open={isAddModalOpen}
        onOk={() => setIsAddModalOpen(false)}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddFinish} onFinishFailed={handleAddFinishFailed} autoComplete="off">
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email!' }]}>
            <Input placeholder="nguyenvana@gmail.com" type="email" />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Please input the full name!' }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input placeholder="0351234567" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Please input the password!' }]}
          >
            <Input.Password
              placeholder="******"
              type="password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: 'Please select your gender!' }]}
            >
              <Select
                onChange={handleGenderChange}
                options={[
                  { value: 'FEMALE', label: 'Nữ' },
                  { value: 'MALE', label: 'Nam' },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Thiết lập phân quyền"
              name="role"
              rules={[{ required: true, message: 'Please select your role!' }]}
            >
              <Select
                onChange={handleRoleChange}
                options={[
                  { value: 'ADMIN_ORDER', label: 'Quản trị đơn hàng' },
                  { value: 'ADMIN_REPORT', label: 'Quản trị báo cáo ' },
                  { value: 'ADMIN_CS', label: 'Quản trị CSKH' },
                  { value: 'ADMIN_MARKETING', label: 'Quản trị Marketing' },
                ]}
              />
            </Form.Item>
          </div>

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
      <Drawer onClose={() => setIsViewModalOpen(false)} open={isViewModalOpen}>
        {currentUser && (
          <div>
            <div className="flex items-center justify-center">
              <img src={currentUser.avatar} alt={currentUser.fullName} className="w-20 my-2 rounded-full" />
            </div>
            <p className="text-center font-bold">{currentUser.fullName}</p>
            <div className="grid grid-cols-2 gap-2 my-6">
              <p className="font-bold">ID</p>
              <p>{currentUser.id}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 my-6">
              <p className="font-bold">Email</p>
              <p>{currentUser.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 my-6">
              <p className="font-bold">Số điện thoại</p>
              <p>{currentUser.phone}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 my-6">
              <p className="font-bold">Giới tính</p>
              <p>{currentUser.gender}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 my-6">
              <p className="font-bold">Trạng thái</p>
              <p>
                {currentUser.active ? (
                  <Tag color="green">Đang hoạt động</Tag>
                ) : (
                  <Tag color="red">Tạm dừng hoạt động</Tag>
                )}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 my-2">
              <p className="font-bold">Vai trò</p>
              <p>{currentUser.role}</p>
            </div>
          </div>
        )}
      </Drawer>

      <DataTable
        title="Quản lý phân quyền admin hệ thống"
        columns={columns}
        data={filteredItems}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        pagination
      />
    </div>
  )
}

export default RoleManagement
