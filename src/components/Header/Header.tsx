import { Layout } from 'antd'
const { Header } = Layout
import { Avatar, Space, Dropdown, Input } from 'antd'
import type { MenuProps } from 'antd'
import { LogOut, Settings, User, Bell, Search } from 'lucide-react'
const HeaderComponent = () => {
  const url = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'

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
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          Đăng xuất
        </a>
      ),
      icon: <LogOut className="w-5 h-5" />,
    },
  ]

  return (
    <Header className="bg-white border-b">
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
              <Avatar src={<img src={url} alt="avatar" />} />
            </Space>
          </Dropdown>
        </div>
      </div>
    </Header>
  )
}

export default HeaderComponent
