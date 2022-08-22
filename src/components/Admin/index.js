import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Table, Modal, Input, Form, message, Radio, Checkbox } from "antd";
import Search from "antd/lib/input/Search";
import React, { PureComponent } from "react";
import { getCurrentUser } from "../../services/auth.service";
import { createUser, deleteUser, getAllUsers, updateUser } from "../../services/user.service";
import { ISSUE_TYPE, USER_TYPE } from "../../utils/constants";
import { getById, getSum, getUserPrivielgeText, getUserPrivielgeValues } from "../../utils/helper";
// import { curUserId } from "../../utils/mockData";
import { getUserModel } from "../../utils/models";
import { MESSAGE, TEXT_USER_TYPE } from "../../utils/strings";
import { getUserColumns } from "../../utils/tableColumns";
import Curtain from "../Curtain";
import TitleBar from "../TitleBar";

import './styles.scss'

const { confirm } = Modal

class Admin extends PureComponent {
    constructor(props) {
        super(props)
        this.formRef = React.createRef()
        this.state = {
            showEditor: false,
            showCurtain: false,
            users: [],
            currentUsers: []
        }
        this.currentUserId = getCurrentUser().id
        this.currentSelectedUserId = -1
        this.searchText = ''
    }

    async componentDidMount() {
        await this.getAllUserList()
    }

    getAllUserList = async () => {
        try {
            this.setState({ showCurtain: true })
            const users = await getAllUsers()
            this.setState({ users })
            this.filterUsers(users)
        } catch (msg) {
            message.error(msg)
        } finally {
            this.setState({ showCurtain: false })
        }
    }

    filterUsers = (tempUsers) => {
        const userlist = tempUsers ? tempUsers : this.state.users
        const newUsers = userlist.filter(user => user.name.includes(this.searchText))
        this.setState({ currentUsers: newUsers })
    }

    onSearch = (e) => {
        this.searchText = e.target ? e.target.value : e
        this.filterUsers()
    }

    openUserEditor = (id = -1) => {
        this.currentSelectedUserId = id
        this.setState({ modalVisible: true })
        if (this.formRef.current) {
            const user = this.state.users.find(user => user.id === id)
            this.formRef.current.setFieldsValue(getUserModel(user))
        }
    }

    handleDeleteUser = (id) => {
        const user = getById(this.state.users, id)
        if (user) {
            confirm({
                title: '是否确定删除用户 ' + user.name,
                icon: <ExclamationCircleOutlined />,
                onOk: async () => {
                    try {
                        this.setState({ showCurtain: true })
                        const msg = await deleteUser(id)
                        message.success(msg)
                        await this.getAllUserList()
                    } catch(msg) {
                        message.error(msg)
                    } finally {
                        this.setState({ showCurtain: false })
                    }
                },
                okText: '确认',
                cancelText: '取消'
            })
        } else {
            message.error(MESSAGE.UnknownError)
        }
        
    }

    handleCreate = async () => {
        const value = this.formRef.current.getFieldsValue()
        try {
            this.setState({ showCurtain: true })
            const msg = await createUser(value.username, value.password, value.type, getSum(value.privilege))
            message.success(msg)
            this.setState({ modalVisible: false })
            this.currentSelectedUserId = -1
            await this.getAllUserList()
        } catch(msg) {
            message.error(msg)
        } finally {
            this.setState({ showCurtain: false })
        }
    }

    handleUpdate = async () => {
        const curUser = getById(this.state.users, this.currentSelectedUserId)
        if (this.currentSelectedUserId < 0 || !curUser) {
            message.error('更新用户信息发生错误，请刷新页面后重试！')
            return
        }
        const value = this.formRef.current.getFieldsValue()
        try {
            this.setState({ showCurtain: true })
            const msg = await updateUser(curUser.id, value.username, value.password, value.type, getSum(value.privilege))
            message.success(msg)
            this.setState({ modalVisible: false })
            this.resetStatus()
            const users = await getAllUsers()
            const newUsers = users.filter((user) => user.name.includes(this.searchText))
            this.setState({
                users,
                currentUsers: newUsers
            })
        } catch (msg) {
            message.error(msg)
        } finally {
            this.setState({ showCurtain: false })
        }
    }

    handleCancel = () => {
        this.setState({ modalVisible: false })
    }

    resetStatus = () => {
        this.currentSelectedUserId = -1
    }

    renderContent = () => {
        const { currentUsers, users } = this.state
        return (
            <div className="main">
                <div className="header">
                    <div>用户列表</div>
                    <Button type="primary" shape="round" icon={<PlusOutlined />} onClick={ e => this.openUserEditor()}>添加新用户</Button>
                </div>
                <div className="searchbar">
                    <Search placeholder="搜索用户名" allowClear onChange={this.onSearch} onSearch={this.onSearch} />
                    <span>当前共有 {users.length} 名用户</span>
                </div>
                <Table columns={getUserColumns(this.openUserEditor, this.handleDeleteUser, this.currentUserId)} dataSource={currentUsers} />
            </div>
        )
    }

    rendeUserModal = (currentUser) => {
        const { modalVisible } = this.state
        const isNew = this.currentSelectedUserId === -1
        return (
            <Modal closable={false} className="createModal" title={isNew ? '添加新用户' : '更改用户信息'} visible={modalVisible} footer={null}>
                <Form ref={this.formRef} labelCol={{span: 7}} wrapperCol={{span: 15}} initialValues={{
                    username: isNew ? '' : currentUser.name,
                    password: '',
                    type: isNew ? USER_TYPE.NORMAL : currentUser.type,
                    privilege: getUserPrivielgeValues(currentUser.privilege)
                }}>
                    <Form.Item label="用户名: " name="username" rules={[{
                        required: true,
                        message: '用户名不能为空！'
                    }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="密码: " name="password" rules={ isNew ? [{
                        required: true,
                        message: '密码不能为空！'
                    }] : []} tooltip={isNew ? null : '如果不打算更改密码，此处留空即可。'}>
                        <Input.Password  />
                    </Form.Item>
                    <Form.Item label="用户类别: " name="type">
                        <Radio.Group>
                            <Radio value={USER_TYPE.NORMAL}>{TEXT_USER_TYPE[USER_TYPE.NORMAL]}</Radio>
                            <Radio value={USER_TYPE.ADMIN}>{TEXT_USER_TYPE[USER_TYPE.ADMIN]}</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="可查看的案件: " name="privilege">
                        <Checkbox.Group>
                            <Checkbox value={ISSUE_TYPE.XingShi}>{getUserPrivielgeText(ISSUE_TYPE.XingShi)}</Checkbox>
                            <Checkbox value={ISSUE_TYPE.XingZheng}>{getUserPrivielgeText(ISSUE_TYPE.XingZheng)}</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item className="buttons" wrapperCol={{offset: 5, span: 15}}>
                        <Button type="primary" htmlType="submit" onClick={ isNew ? this.handleCreate : this.handleUpdate }>{isNew ? '创建' : '更新'}</Button>
                        <Button htmlType="button" onClick={this.handleCancel}>取消</Button>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    render() {
        const { showCurtain, users } = this.state
        if (users.length === 0) {
            return null
        }
        const currentUser = getById(users, this.currentUserId) || {}
        const currentSelectedUser = getById(users, this.currentSelectedUserId) || {}
        return (
            <>
                <TitleBar isHome={false} showUserManagement={false} currentUserId={this.currentUserId} userList={users} />
                {
                    currentUser.type !== USER_TYPE.ADMIN ?
                    <div className="noPrivilege">{MESSAGE.NoPrivilege}</div> :
                    (
                        <>
                            {this.renderContent()}
                            {this.rendeUserModal(currentSelectedUser)}
                        </>
                    )
                }
                <Curtain visible={showCurtain} />
            </>
        )
    }
}

export default Admin
