import {
  CategoryMangament,
  Dashboard,
  ForgotPassword,
  Login,
  MarketingManagement,
  OrderManagement,
  ProductReportManagement,
  ReturnOrderManagement,
  RoleManagement,
  ShopReportManagement,
  StoreManagement,
  SystemUsersManagement,
  TransactionManagement,
  WithdrawManagement,
} from './pages'
import { admin_routes, common_routes } from './constants/router-links'
import HomeLayout from './pages/HomeLayout'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ProtectedByRole from './components/shared/ProtectedByRole'
import Protected from './components/shared/Protected'

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
      element: (
        <Protected>
          <HomeLayout />
        </Protected>
      ),
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
          path: admin_routes.withdraw,
          element: (
            <ProtectedByRole role="ADMIN">
              <WithdrawManagement />
            </ProtectedByRole>
          ),
        },
        {
          path: admin_routes.store,
          element: <StoreManagement />,
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
          path: admin_routes.marketing,
          element: <MarketingManagement />,
        },
      ],
    },
  ])
  return <RouterProvider router={router} />
}

export default App
