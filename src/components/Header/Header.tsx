/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStoreSelectors } from '@/store/auth-store'
import { LoginData } from '@/types/user.type'
import { Layout, Modal, Select } from 'antd'
const { Header } = Layout
import { Avatar, Space, Dropdown, Input } from 'antd'
import type { MenuProps } from 'antd'
import { LogOut, Settings, User, Bell, Search } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Logo from '@/assets/logo/Logo1.png'
import { useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { StoreType } from '@/types/store.type'
import { OrderItem } from '@/types/order.type'

const HeaderComponent = ({ auth }: { auth: LoginData }) => {
  const axiosPrivate = useAxiosPrivate()
  const removeAuth = useAuthStoreSelectors.use.removeAuth()
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [searchType, setSearchType] = useState('store')
  const [searchResults, setSearchResults] = useState<StoreType[] | OrderItem[]>([])
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)

  const navigate = useNavigate()
  const showModal = () => {
    setOpen(true)
  }

  const searchMutation = useMutation({
    mutationFn: async (queryString: string) => {
      const searchParam = searchType === 'store' ? 'shopName' : 'id'
      const resp = await axiosPrivate.get(`/admin/${searchType}/search?${searchParam}.contains=${queryString}`)
      return resp.data.data.content
    },
    onSuccess: (data) => {
      setSearchResults(data)
      setIsDropdownVisible(true)
    },
  })

  const handleOk = () => {
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
      removeAuth()
      navigate('/login')
      toast.success('Đăng xuất thành công!')
    }, 1000)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    if (query) {
      searchMutation.mutate(query)
    } else {
      setSearchResults([])
      setIsDropdownVisible(false)
    }
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          Trang cá nhân
        </a>
      ),
      icon: <User className="w-5 h-5" />,
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          Cài đặt
        </a>
      ),
      icon: <Settings className="w-5 h-5" />,
    },
    {
      key: '3',
      label: <button onClick={showModal}>Đăng xuất</button>,
      icon: <LogOut className="w-5 h-5" />,
    },
  ]

  const options = [
    {
      value: 'store',
      label: 'Cửa hàng',
    },
    {
      value: 'order',
      label: 'Đơn hàng',
    },
  ]
  const isStoreType = (result: StoreType | OrderItem): result is StoreType => {
    return (result as StoreType).shopName !== undefined
  }
  return (
    <Header className="p-0 shadow-md bg-white fixed top-0 left-0 right-0 z-10">
      <Modal title="Xác nhận" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <p>Bạn chắc chắn muốn đăng xuất khỏi tài khoản này?</p>
      </Modal>
      <div className="flex justify-between items-center">
        <div>
          <img src={Logo} alt="" className="w-[150px]" />
        </div>
        <div className="relative flex items-center gap-4">
          <Space.Compact>
            <Select defaultValue="store" options={options} onChange={(value) => setSearchType(value)} />
            <Input
              placeholder="Tìm kiếm..."
              className="w-[400px]"
              suffix={<Search className="w-5 h-5 text-[#1677ff]" />}
              onChange={handleSearchChange}
              allowClear
            />
          </Space.Compact>
          {isDropdownVisible && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white shadow-md border rounded z-10 scroll-y-auto12">
              {searchResults.map((result) => (
                <div key={result.id} className="p-2 hover:bg-gray-100 cursor-pointer">
                  {isStoreType(result) ? (
                    <div className="grid grid-cols-4 gap-1">
                      <img src={result.logo} className=" w-20 col-span-1" alt="" />
                      <div className="gap-2 col-span-3">
                        <p>
                          {result.shopName} - {result.address}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>
                        Đơn hàng<strong> {result.id}</strong> của {result.storeInfo.name}{' '}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5" />
          <Dropdown menu={{ items }}>
            <Space>
              <Avatar src={<img src={auth?.user.avatar} alt="avatar" />} />
            </Space>
          </Dropdown>
        </div>
      </div>
    </Header>
  )
}

export default HeaderComponent
