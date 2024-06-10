/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormProps } from 'antd'
import { Button, Form, Input } from 'antd'
import background from '@/assets/system.jpg'
import { useNavigate } from 'react-router-dom'
import { useAuthStoreSelectors } from '@/store/auth-store'
import toast from 'react-hot-toast'
import commonApi from '@/api/commonApi'
import Logo from '@/assets/logo/Logo1.png'

type FieldType = {
  username: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const addAuth = useAuthStoreSelectors.use.addAuth()

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const userLogin = {
      email: values.username,
      password: values.password,
    }
    try {
      const resp = await commonApi.login(userLogin)
      if (resp.status === 200) {
        addAuth(resp.data.data)
        toast.success('Đăng nhập thành công')
        switch (resp.data.data.user.role) {
          case 'ADMIN':
            navigate('/')
            break
          case 'ADMIN_ORDER':
            navigate('/return-orders')
            break
          case 'ADMIN_REPORT':
            navigate('/report-products')
            break
          case 'ADMIN_MARKETING':
            navigate('/marketing-products')
            break
          default:
            navigate('/')
            break
        }
      } else {
        toast.error('Đăng nhập thất bại')
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  return (
    <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl w-full p-10 bg-white rounded-xl">
        <div className="flex items-center justify-center">
          <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <img src={Logo} alt="" />
              <div>
                <p className="text-lg font-bold text-center">HỆ THỐNG QUẢN LÝ FNEST</p>
              </div>
              <Form
                name="basic"
                labelCol={{ span: 5 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item<FieldType>
                  label="Email"
                  name="username"
                  className="dark:text-white"
                  rules={[{ required: true, message: 'Please input your email!' }]}
                >
                  <Input placeholder="nguyenvana@gmail.com" />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password placeholder="••••••••" />
                </Form.Item>
                <div className="flex justify-end">
                  <Button type="link" onClick={() => navigate('/forgot-password')}>
                    Quên mật khẩu?
                  </Button>
                </div>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="w-full h-10">
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <img src={background} alt="Background" className="w-full h-full object-cover " />
        </div>
      </div>
    </section>
  )
}

export default Login
