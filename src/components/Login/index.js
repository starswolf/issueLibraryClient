import { PureComponent } from "react";
import { Form, Button, Input, message } from 'antd'

import './styles.scss'
import { login } from "../../services/auth.service";

class Login extends PureComponent {
    onFinish = async (values) => {
        try {
            await login(values.username, values.password)
            window.location.href = '/home'
        } catch (ex) {
            if (ex.code === -1) {
                message.error(ex.msg)
            } else {
                message.error('用户名或密码错误，请重新输入！')
            }
        }
    }

    onFinishFailed = (error) => {
        console.log('Failed')
    }

    render() {
        return (
            <div className="mainForm">
                <div className="title">金华海关案件管理系统</div>
                <Form name="loginForm" className="loginForm" labelCol={{span: 5}} wrapperCol={{span: 15}}
                    onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} autoComplete="off">
                    <Form.Item label="用户名: " name="username" rules={[{
                        required: true,
                        message: '请输入用户名'
                    }]}>
                        <Input placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item label="密码: " name="password">
                        <Input.Password placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item className="buttons" wrapperCol={{span: 20}}>
                        <Button type="primary" htmlType="submit">登录</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default Login
