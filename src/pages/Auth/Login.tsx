/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormProps } from 'antd'
import { Button, Form, Input } from 'antd'
import background from '@/assets/system.jpg'
import { useNavigate } from 'react-router-dom'
import { useAuthStoreSelectors } from '@/store/auth-store'
import toast from 'react-hot-toast'
import commonApi from '@/api/commonApi'

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
        navigate('/')
      } else {
        toast.error('Đăng nhập thất bại')
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  return (
    <>
      <section style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div className="">
                <p className="text-lg font-bold text-center">HỆ THỐNG QUẢN LÝ FNEST</p>
              </div>
              <Form
                name="basic"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
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
                  <Input placeholder="nguyenvana@gmail.comx" />
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
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
