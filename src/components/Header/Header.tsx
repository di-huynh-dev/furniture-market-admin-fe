import { useAuthStoreSelectors } from '@/store/auth-store'
import { LoginData } from '@/types/user.type'
import { Layout, Modal } from 'antd'
const { Header } = Layout
import { Avatar, Space, Dropdown, Input } from 'antd'
import type { MenuProps } from 'antd'
import { LogOut, Settings, User, Bell, Search } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const HeaderComponent = ({ auth }: { auth: LoginData }) => {
  const removeAuth = useAuthStoreSelectors.use.removeAuth()
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const navigate = useNavigate()
  const showModal = () => {
    setOpen(true)
  }

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
    console.log('Clicked cancel button')
    setOpen(false)
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
      label: (
        <button
          onClick={() => {
            showModal()
          }}
        >
          Đăng xuất
        </button>
      ),
      icon: <LogOut className="w-5 h-5" />,
    },
  ]

  return (
    <Header className="bg-white border-b">
      <Modal title="Xác nhận" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <p>Bạn chắc chắn muốn đăng xuất khỏi tài khoản này?</p>
      </Modal>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm..."
            className="w-[400px]"
            suffix={<Search className="w-5 h-5 text-[#1677ff]" />}
            allowClear
          />
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
