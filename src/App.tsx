import {
  CategoryMangament,
  ChatCenter,
  Dashboard,
  ForgotPassword,
  Login,
  OrderManagement,
  ProductReportManagement,
  ReturnOrderManagement,
  RoleManagement,
  ShopReportManagement,
  StatisticManagement,
  SystemUsersManagement,
  TransactionManagement,
} from './pages'
import { admin_routes, common_routes } from './constants/router-links'
import HomeLayout from './pages/HomeLayout'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ProtectedByRole from './components/shared/ProtectedByRole'

function App() {
  const router = createBrowserRouter([
    {
      path: common_routes.login,
      element: <Login />,
    },
    {
      path: common_routes.forgotPassword,
      element: <ForgotPassword />,
    },
    {
      path: '/',
      element: <HomeLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedByRole role="ADMIN">
              <Dashboard />
            </ProtectedByRole>
          ),
        },
        {
          path: admin_routes.category,
          element: (
            <ProtectedByRole role="ADMIN">
              <CategoryMangament />
            </ProtectedByRole>
          ),
        },
        {
          path: admin_routes.order,
          element: (
            <ProtectedByRole role="ADMIN">
              <OrderManagement />
            </ProtectedByRole>
          ),
        },
        {
          path: admin_routes.users,
          element: (
            <ProtectedByRole role="ADMIN">
              <SystemUsersManagement />
            </ProtectedByRole>
          ),
        },
        {
          path: admin_routes.roles,
          element: (
            <ProtectedByRole role="ADMIN">
              <RoleManagement />
            </ProtectedByRole>
          ),
        },
        {
          path: admin_routes.transaction,
          element: (
            <ProtectedByRole role="ADMIN">
              <TransactionManagement />
            </ProtectedByRole>
          ),
        },
        {
          path: admin_routes.report_shops,
          element: <ShopReportManagement />,
        },
        {
          path: admin_routes.report_products,
          element: <ProductReportManagement />,
        },
        {
          path: admin_routes.return_orders,
          element: <ReturnOrderManagement />,
        },
        {
          path: admin_routes.chat,
          element: (
            <ProtectedByRole role="ADMIN_CS">
              <ChatCenter />
            </ProtectedByRole>
          ),
        },
        {
          path: admin_routes.statictis,
          element: <StatisticManagement />,
        },
      ],
    },
  ])
  return <RouterProvider router={router} />
}

export default App
