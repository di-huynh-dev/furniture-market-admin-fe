import React from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components'
import Sidebar from '@/components/Sider/Sidebar'
const { Content, Footer } = Layout

const HomeLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content className="p-4">
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Furniture Market ©{new Date().getFullYear()} Created by DD</Footer>
      </Layout>
    </Layout>
  )
}

export default HomeLayout
