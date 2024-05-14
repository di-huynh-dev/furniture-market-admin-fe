import type { FormProps } from 'antd'
import { Button, Form, Input } from 'antd'
import logo from '@/assets/logo/Logo1.png'
import background from '@/assets/system.jpg'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
type FieldType = {
  username?: string
  password?: string
  remember?: string
}

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values)
}

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

const ForgotPassword = () => {
  const navigate = useNavigate()
  return (
    <section style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div>
              <ArrowLeft onClick={() => navigate(-1)} />
              <div className="flex justify-center">
                <img src={logo} alt="" className="w-32" />
              </div>
              <p className="text-lg font-bold text-center">HỆ THỐNG QUẢN LÝ FNEST</p>
            </div>
            <p className="font-bold">Lấy lại mật khẩu</p>
            <Form
              name="basic"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item<FieldType>
                label="Email"
                name="username"
                className="dark:text-white"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input placeholder="nguyenvana@gmail.comx" />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Lấy mã xác thực
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword
