import {
  CategoryMangament,
  ChatCenter,
  Dashboard,
  FinancialManagement,
  ForgotPassword,
  Login,
  ProductReportManagement,
  ReturnOrderManagement,
  RoleManagement,
  ShopReportManagement,
  StatisticManagement,
  SystemUsersManagement,
} from './pages'
import { admin_routes, common_routes } from './constants/router-links'
import HomeLayout from './pages/HomeLayout'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

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
          element: <Dashboard />,
        },
        {
          path: admin_routes.category,
          element: <CategoryMangament />,
        },
        {
          path: admin_routes.users,
          element: <SystemUsersManagement />,
        },
        {
          path: admin_routes.roles,
          element: <RoleManagement />,
        },
        {
          path: admin_routes.financial,
          element: <FinancialManagement />,
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
          path: admin_routes.financial,
          element: <FinancialManagement />,
        },
        {
          path: admin_routes.return_orders,
          element: <ReturnOrderManagement />,
        },
        {
          path: admin_routes.chat,
          element: <ChatCenter />,
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
