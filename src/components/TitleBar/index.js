import { Button, Breadcrumb, Dropdown, Form, Input, Menu, message, Modal, Space } from "antd";
import PropTypes from 'prop-types';
import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser, logout } from "../../services/auth.service";
import { USER_TYPE } from "../../utils/constants";
import { getById } from "../../utils/helper";
import { getPwdModel } from "../../utils/models";
import { MESSAGE } from "../../utils/strings";
import { updatePwd } from "../../services/user.service";

import './styles.scss';

class TitleBar extends PureComponent {

    constructor(props) {
        super(props)
        this.pwdFormRef = React.createRef()
        this.state = {
            modalVisible: false
        }
    }

    openPwdEditor = () => {
        this.setState({ modalVisible: true })
        if (this.pwdFormRef.current) {
            this.pwdFormRef.current.setFieldsValue(getPwdModel())
        }
    }

    handleUpdatePwd = async () => {
        const value = this.pwdFormRef.current.getFieldsValue()
        if (value.newPwd !== value.confirm) {
            message.error(MESSAGE.InconsistentPassword)
            return
        }
        try {
            const msg = await updatePwd(this.props.currentUserId, value.oldPwd, value.newPwd)
            message.success(msg)
            this.setState({ modalVisible: false })
        } catch(msg) {
            message.error(msg)
        }
    }

    handleCancelPwd = () => {
        this.setState({ modalVisible: false })
    }

    renderPwdModal = () => {
        const { modalVisible } = this.state
        return (
            <Modal closable={false} className="pwdModal" title="更改密码" visible={modalVisible} footer={null}>
                <Form ref={this.pwdFormRef} labelCol={{span: 6}} wrapperCol={{span: 14}} initialValues={{
                    oldPwd: '',
                    newPwd: '',
                    confirm: ''
                }}>
                    <Form.Item label="旧密码：" name="oldPwd" rules={[{
                        required: true,
                        message: MESSAGE.EmptyOldPassword
                    }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="新密码：" name="newPwd" rules={[{
                        required: true,
                        message: MESSAGE.EmptyNewPassword
                    }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="再次输入密码：" name="confirm" rules={[{
                        required: true,
                        message: MESSAGE.EmptyConfirmPassword
                    }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item className="buttons" wrapperCol={{offset: 5, span: 15}}>
                        <Button type="primary" htmlType="submit" onClick={ this.handleUpdatePwd }>{'更新'}</Button>
                        <Button htmlType="button" onClick={this.handleCancelPwd}>取消</Button>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    render() {
        const { showUserManagement, isHome, userList, currentUserId } = this.props
        const user = getById(userList, currentUserId) || {}
        const items = [{
            label: <span onClick={this.openPwdEditor}>更改密码</span>,
            key: '0'
        }]
        if (showUserManagement && user.type === USER_TYPE.ADMIN) {
            items.push({
                label: <Link to={'/admin'}>管理用户</Link>,
                key: '1'
            })
        }
        items.push({
            label: <span onClick={logout}>退出登录</span>,
            key: '2'
        })
        const menu = (
            <Menu style={{minWidth: 80}} items={items} />
        )
        return (
            <>
                <div className="titlebar">
                    <div className="title">金华海关案件管理系统</div>
                </div>
                <div className="pathbar">
                    <div>
                        {
                            <Breadcrumb className="path" separator='>'>
                                <Breadcrumb.Item>
                                    <Link to={'/home'}>主页</Link>
                                </Breadcrumb.Item>
                                {!isHome && <Breadcrumb.Item>用户管理</Breadcrumb.Item>}
                            </Breadcrumb>
                        }
                    </div>
                    <div className="right">
                        <span>欢迎你，</span>
                        <Dropdown placement="bottomRight" overlay={menu} trigger={['hover']}>
                            <Space>{user.name}</Space>
                        </Dropdown>
                    </div>
                </div>
                { this.renderPwdModal() }
            </>
        )
    }
}

TitleBar.protTypes = {
    showUserManagement: PropTypes.bool,
    isHome: PropTypes.bool,
    userList: PropTypes.object,
    currentUserId: PropTypes.number
}

export default TitleBar
