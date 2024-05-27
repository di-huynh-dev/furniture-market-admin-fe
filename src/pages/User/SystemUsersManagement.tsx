/* eslint-disable @typescript-eslint/no-explicit-any */
import { query_keys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { UserType } from '@/types/user.type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import DataTable, { TableColumn } from 'react-data-table-component'
import { Badge, Popconfirm, Tag, Drawer } from 'antd'
import { AiFillLock, AiOutlineEye, AiOutlineSearch } from 'react-icons/ai'
import toast from 'react-hot-toast'
import { useMemo, useState } from 'react'
import { SearchProps } from 'antd/es/input'
import Search from 'antd/es/input/Search'

const SystemUsersManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [filterText, setFilterText] = useState('')

  const {
    data: userList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [query_keys.USER_LIST],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/admin/user')
      return resp.data.data
    },
  })

  const filteredItems = userList?.filter(
    (item: UserType) => item.email && item.email.toLowerCase().includes(filterText.toLowerCase()),
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
      cell: (row) => row.id,
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
      cell: (row) => (row.active ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Tạm dừng hoạt động</Tag>),
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

  if (isLoading) return <div>Loading</div>
  if (isError) return <div>Lỗi </div>
  return (
    <div>
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
        title="Quản lý người dùng hệ thống"
        columns={columns}
        data={filteredItems}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        pagination
      />
    </div>
  )
}

export default SystemUsersManagement
