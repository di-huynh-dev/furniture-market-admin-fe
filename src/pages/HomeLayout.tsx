import React, { useState } from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components'
import Sidebar from '@/components/Sider/Sidebar'
import useAuthStore from '@/store/auth-store'
const { Content, Footer } = Layout

const HomeLayout: React.FC = () => {
  const auth = useAuthStore((state) => state.admin_auth)
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Layout>
      <Sidebar auth={auth} collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: 'margin-left 0.2s',
        }}
      >
        <Header auth={auth} />
        <Content style={{ marginTop: 64, padding: '10px 12px', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Furniture Market ©{new Date().getFullYear()} Created by DD</Footer>
      </Layout>
    </Layout>
  )
}

export default HomeLayout
