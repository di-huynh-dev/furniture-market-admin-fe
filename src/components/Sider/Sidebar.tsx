import React from 'react'
import {
  BarChartHorizontalBig,
  ListCollapse,
  Users,
  User,
  ShieldPlus,
  MessageSquareWarning,
  Armchair,
  Store,
  ShoppingCart,
  BadgeDollarSign,
  Undo2,
  ArrowLeftRight,
  ListOrdered,
  Undo,
  PartyPopper,
} from 'lucide-react'
import type { MenuProps } from 'antd'
import { Layout, Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import { admin_routes } from '@/constants/router-links'
import { LoginData } from '@/types/user.type'

const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const Sidebar = ({
  auth,
  collapsed,
  setCollapsed,
}: {
  auth: LoginData
  collapsed: boolean
  setCollapsed: (value: boolean) => void
}) => {
  const navigate = useNavigate()

  const items: MenuItem[] = [
    getItem('Dashboard', '1', <BarChartHorizontalBig className="w-5 h-5" />),
    getItem('Danh mục', '2', <ListCollapse className="w-5 h-5" />),
    getItem('Người dùng', 'sub1', <Users className="w-5 h-5" />, [
      getItem('Hệ thống', '3', <User className="w-5 h-5" />),
      getItem('Quản trị', '4', <ShieldPlus className="w-5 h-5" />),
    ]),
    getItem('Giao dịch', 'sub2', <BadgeDollarSign />, [
      getItem('Hệ thống', '5', <ArrowLeftRight className="w-5 h-5" />),
      getItem('Yêu cầu rút', '6', <Undo2 className="w-5 h-5" />),
    ]),
    getItem('Báo cáo', 'sub3', <MessageSquareWarning className="w-5 h-5" />, [
      getItem('Sản phẩm', '7', <Armchair className="w-5 h-5" />),
      getItem('Shop', '8', <Store className="w-5 h-5" />),
    ]),
    getItem('Đơn hàng', 'sub4', <ShoppingCart className="w-5 h-5" />, [
      getItem('Hệ thống', '9', <ListOrdered className="w-5 h-5" />),
      getItem('Đơn hoàn', '10', <Undo className="w-5 h-5" />),
    ]),
    getItem('Quảng cáo', '11', <PartyPopper className="w-5 h-5" />),
  ]

  const handleNavigate = (key: React.Key) => {
    switch (key) {
      case '1':
        navigate('/')
        break
      case '2':
        navigate(admin_routes.category)
        break
      case '3':
        navigate(admin_routes.users)
        break
      case '4':
        navigate(admin_routes.roles)
        break
      case '5':
        navigate(admin_routes.transaction)
        break
      case '6':
        navigate(admin_routes.withdraw)
        break
      case '7':
        navigate(admin_routes.report_products)
        break
      case '8':
        navigate(admin_routes.report_shops)
        break
      case '9':
        navigate(admin_routes.order)
        break
      case '10':
        navigate(admin_routes.return_orders)
        break
      case '11':
        navigate(admin_routes.marketing)
        break
      default:
        break
    }
  }

  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 70,
        bottom: 0,
        background: 'white',
      }}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="flex justify-center">
        <img src={auth?.user.avatar} className="w-10 h-10 rounded-full" alt="" />
      </div>
      <p className="font-bold text-center">{auth?.user.fullName}</p>
      {collapsed ? null : (
        <p className="text-center text-xs">
          {auth?.user.role === 'ADMIN'
            ? 'Quản trị hệ thống'
            : auth?.user.role === 'ADMIN_ORDER'
            ? 'Quản trị Đơn hàng'
            : auth?.user.role === 'ADMIN_REPORT'
            ? 'Quản trị Báo cáo'
            : auth?.user.role === 'ADMIN_MARKETING'
            ? 'Quản trị Marketing'
            : auth?.user.role === 'ADMIN_CSKH'
            ? 'Quản trị CSKH'
            : ''}
        </p>
      )}
      <Menu
        theme="light"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
        onSelect={({ key }) => handleNavigate(key)}
      />
    </Sider>
  )
}

export default Sidebar
