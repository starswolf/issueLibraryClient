import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Row, Col, Descriptions, Button, Select, DatePicker, Table, Modal, Form, Input, message } from "antd";
import moment from 'moment';
import TextArea from "antd/lib/input/TextArea";
import React, { PureComponent } from "react";
import { ISSUE_ACTIONS, ISSUE_COMPLETE_STATUS, OPTION_ALL } from "../../utils/constants";
import { getAvailableActions, getById, getIssueCompleteStatus, getIssueEndTime, getIssueType, getOptions, getToday, isAdmin, isEmpty } from "../../utils/helper";
import { getIssueColumns } from "../../utils/tableColumns";
import TitleBar from "../TitleBar";

import './styles.scss'
import { createIssue, deleteIssue, getAllIssues, updateIssue } from "../../services/issue.service";
import { getAllUsers } from "../../services/user.service";
import { getIssueModel } from "../../utils/models";
import { MESSAGE, TEXT_ALL } from "../../utils/strings";
// import { curUserId } from "../../utils/mockData";
import { getCurrentUser } from "../../services/auth.service";

const { Option } = Select
const { Search } = Input
const { confirm } = Modal
const { RangePicker } = DatePicker

class Home extends PureComponent {
    constructor(props) {
        super(props)
        this.currentUserId = getCurrentUser().id
        this.issueFormRef = React.createRef()
        this.state = {
            issueModalVisible: false,
            users: [],
            issueList: [],
            currentIssues: []
        }
        this.filterStatus = {
            issueName: '',
            issueType: -1,
            action: -1,
            completeStatus: -1,
            ownerId: -1,
            targetName: '',
            startTime: null,
            endTime: null
        }
        this.resetCounts()
    }

    async componentDidMount() {
        await this.getAllIssueList()
        const users = await getAllUsers()
        this.setState({ users })
    }

    resetCounts = () => {
        this.ownStatus = {
            timeout: 0,
            redRisk: 0,
            orangeRisk: 0,
            unComplete: 0,
            complete: 0,
            all: 0
        }
        this.allStatus = {
            timeout: 0,
            redRisk: 0,
            orangeRisk: 0,
            unComplete: 0,
            complete: 0,
            all: 0
        }
    }

    getAllIssueList = async () => {
        try {
            const issueList = await getAllIssues()
            this.resetCounts()
            issueList.forEach(issue => {
                issue.key = issue.id
                issue.type = getIssueType(issue)
                issue.startTime = parseInt(issue.startTimeArr[0], 10)
                if (issue.status === -1) {
                    issue.completeTime = parseInt(issue.completeTime, 10)
                }
                issue.endTime = getIssueEndTime(issue)
                const isOwn = issue.ownerId === this.currentUserId
                const completeStatus = getIssueCompleteStatus(issue)
                issue.completeStatus = completeStatus
                if (completeStatus === ISSUE_COMPLETE_STATUS.Complete) {
                    this.allStatus.complete++
                    if (isOwn) this.ownStatus.complete++
                } else {
                    this.allStatus.unComplete++
                    if (isOwn) this.ownStatus.unComplete++
                    if (completeStatus === ISSUE_COMPLETE_STATUS.TimeOut) {
                        this.allStatus.timeout++
                        if (isOwn) this.ownStatus.timeout++
                    } else if (completeStatus === ISSUE_COMPLETE_STATUS.RedRisk) {
                        this.allStatus.redRisk++
                        if (isOwn) this.ownStatus.redRisk++
                    } else if (completeStatus === ISSUE_COMPLETE_STATUS.OrangeRisk) {
                        this.allStatus.orangeRisk++
                        if (isOwn) this.ownStatus.orangeRisk++
                    }
                }
            })
            this.setState({ issueList })
            this.ownStatus.all = this.ownStatus.complete + this.ownStatus.unComplete
            this.allStatus.all = this.allStatus.complete + this.allStatus.unComplete
            this.filterIssues(issueList)
        } catch (msg) {
            message.error(msg)
        }
    }

    filterIssues = (tempIssueList) => {
        const issueList = tempIssueList ? tempIssueList : this.state.issueList
        const { issueName, issueType, action, completeStatus, ownerId, targetName, startTime, endTime} = this.filterStatus
        const newIssues = issueList.filter(issue => {
            if (!isEmpty(issueName) && issue.issueName.indexOf(issueName) < 0) {
                return false
            }
            if (issueType !== -1 && issue.type !== issueType) {
                return false
            }
            if (action !== -1 && issue.action !== action) {
                return false
            }
            if (completeStatus !== -1 && issue.completeStatus !== completeStatus) {
                return false
            }
            if (ownerId !== -1 && issue.ownerId !== ownerId) {
                return false
            }
            if (!isEmpty(targetName) && issue.targetName.indexOf(targetName) < 0) {
                return false
            }
            if (startTime !== null && (startTime.length !== 2 || moment(issue.startTime).isBefore(startTime[0]) ||
                moment(issue.startTime).isAfter(startTime[1]))) {
                return false
            }
            if (endTime !== null && (endTime.length !== 2 || moment(issue.endTime).isBefore(endTime[0]) ||
                moment(issue.endTime).isAfter(endTime[1]))) {
                    return false
            }
            return true
        })
        this.setState({ currentIssues: newIssues })
    }

    getUserNameById = (id) => {
        return (this.state.users.find((user) => user.id === id) || {}).name || ''
    }

    openIssueEditor = () => {
        this.setState({ issueModalVisible: true })
        if (this.issueFormRef.current) {
            this.issueFormRef.current.setFieldsValue(getIssueModel())
        }
    }

    onSearchIssueName = (e) => {
        this.filterStatus.issueName = e.target ? e.target.value : e
        this.filterIssues()
    }

    onIssueTypeChange = (value) => {
        this.filterStatus.issueType = value
        this.filterIssues()
    }

    onActionFilterChange = (value) => {
        this.filterStatus.action = value
        this.filterIssues()
    }

    onIssueStatusChange = (value) => {
        this.filterStatus.completeStatus = value
        this.filterIssues()
    }

    onOwnerChange = (value) => {
        this.filterStatus.ownerId = value
        this.filterIssues()
    }

    onSearchTargetName = (e) => {
        this.filterStatus.targetName = e.target ? e.target.value : e
        this.filterIssues()
    }

    onStartTimeFilterChange = (date) => {
        this.filterStatus.startTime = date
        this.filterIssues()
    }

    onEndTimeFilterChange = (date) => {
        this.filterStatus.endTime = date
        this.filterIssues()
    }

    getAllUsersList = () => {
        const allusers = [<Option key={OPTION_ALL} value={OPTION_ALL}>{TEXT_ALL}</Option>]
        this.state.users.forEach(user => {
            allusers.push(<Option key={user.id} value={user.id}>{user.name}</Option>)
        })
        return allusers
    }

    handleCreateIssue = async () => {
        const value = this.issueFormRef.current.getFieldsValue()
        try {
            const msg = await createIssue(value.issueName, value.action, value.targetName, this.currentUserId, 0, value.startTime.valueOf(), value.details)
            message.success(msg)
            this.setState({ issueModalVisible: false })
            await this.getAllIssueList()
        } catch(msg) {
            message.error(msg)
        }
    }

    handleCancelIssue = () => {
        this.setState({
            issueModalVisible: false
        })
    }

    handleMoveToNextStep = (issueId) => {
        const issue = getById(this.state.issueList, issueId)
        if (issue) {
            confirm({
                title: '是否确认将该案件移至下一阶段',
                icon: <ExclamationCircleOutlined />,
                onOk: async () => {
                    try {
                        let newStatus = issue.status + 1
                        if (newStatus >= ISSUE_ACTIONS[issue.action].steps.length) {
                            newStatus = -1
                        }
                        const timeArr = issue.startTimeArr
                        timeArr.push(getToday())
                        const msg = await updateIssue(issueId, issue.issueName, issue.action, issue.targetName, issue.ownerId, newStatus, timeArr, issue.details)
                        message.success(msg)
                        await this.getAllIssueList()
                    } catch(msg) {
                        message.error(msg)
                    }
                },
                okText: '确认',
                cancelText: '取消'
            })
        } else {
            message.error(MESSAGE.UnknownError)
        }
    }

    handleMarkComplete = (issueId) => {
        const issue = getById(this.state.issueList, issueId)
        if (issue) {
            confirm({
                title: '是否确定将该案件标记完成',
                icon: <ExclamationCircleOutlined />,
                onOk: async () => {
                    try {
                        const msg = await updateIssue(issueId, issue.issueName, issue.action, issue.targetName, issue.ownerId, -1, issue.startTimeArr, getToday(), issue.details)
                        message.success(msg)
                        await this.getAllIssueList()
                    } catch(msg) {
                        message.error(msg)
                    }
                },
                okText: '确认',
                cancelText: '取消'
            })
        } else {
            message.error(MESSAGE.UnknownError)
        }
    }

    handleDeleteIssue = (issueId) => {
        confirm({
            title: '是否确定删除该案件',
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                try {
                    const msg = await deleteIssue(issueId)
                    message.success(msg)
                    await this.getAllIssueList()
                } catch(msg) {
                    message.error(msg)
                }
            },
            okText: '确认',
            cancelText: '取消'
        })
    }

    renderSummary = () => {
        return (
            <div className="summary">
                <Row>
                    <Col className="title" span={6}></Col>
                    <Col className="timeout" span={3}>超时未完成</Col>
                    <Col className="redRisk" span={3}>红色警告</Col>
                    <Col className="orangeRisk" span={3}>橙色警告</Col>
                    <Col className="uncomplete" span={3}>所有未完成</Col>
                    <Col className="complete" span={3}>已完成</Col>
                    <Col className="all" span={3}>总数</Col>
                </Row>
                <Row>
                    <Col className="name" span={6}>你名下的案件</Col>
                    <Col className="timeout" span={3}>{this.ownStatus.timeout}</Col>
                    <Col className="redRisk" span={3}>{this.ownStatus.redRisk}</Col>
                    <Col className="orangeRisk" span={3}>{this.ownStatus.orangeRisk}</Col>
                    <Col className="uncomplete" span={3}>{this.ownStatus.unComplete}</Col>
                    <Col className="complete" span={3}>{this.ownStatus.complete}</Col>
                    <Col className="all" span={3}>{this.ownStatus.all}</Col>
                </Row>
                <Row>
                    <Col className="name" span={6}>你可查看的案件</Col>
                    <Col className="timeout" span={3}>{this.allStatus.timeout}</Col>
                    <Col className="redRisk" span={3}>{this.allStatus.redRisk}</Col>
                    <Col className="orangeRisk" span={3}>{this.allStatus.orangeRisk}</Col>
                    <Col className="uncomplete" span={3}>{this.allStatus.unComplete}</Col>
                    <Col className="complete" span={3}>{this.allStatus.complete}</Col>
                    <Col className="all" span={3}>{this.allStatus.all}</Col>
                </Row>
            </div>
        )
    }

    renderFilterSection = () => {
        return (
            <Descriptions className="filters">
                <Descriptions.Item label="案件名称">
                    <Search placeholder="搜索案件名称" allowClear onChange={this.onSearchIssueName} onSearch={this.onSearchIssueName} />
                </Descriptions.Item>
                <Descriptions.Item label="案件类型">
                    <Select defaultValue={OPTION_ALL} onChange={this.onIssueTypeChange}>
                        { getOptions([{ name: '刑事案件', value: 1 }, { name: '行政案件', value: 2 }]) }
                    </Select>
                </Descriptions.Item>
                <Descriptions.Item label="采取措施">
                    <Select defaultValue={OPTION_ALL} onChange={this.onActionFilterChange}>
                        { getOptions(ISSUE_ACTIONS) }
                    </Select>
                </Descriptions.Item>
                <Descriptions.Item label="案件状态">
                    <Select defaultValue={OPTION_ALL} onChange={this.onIssueStatusChange}>
                        { getOptions([MESSAGE.Complete, MESSAGE.NoRisk, MESSAGE.OrangeRisk, MESSAGE.RedRisk, MESSAGE.TimeOut]) }
                    </Select>
                </Descriptions.Item>
                <Descriptions.Item label="负责人">
                    <Select defaultValue={OPTION_ALL} onChange={this.onOwnerChange}>
                        { this.getAllUsersList() }
                    </Select>
                </Descriptions.Item>
                <Descriptions.Item label="案件对象">
                    <Search placeholder="搜索案件对象" allowClear onChange={this.onSearchTargetName} onSearch={this.onSearchTargetName} />
                </Descriptions.Item>
                <Descriptions.Item label="登记日期">
                    <RangePicker allowClear placeholder={['开始时间', '结束时间']} onChange={this.onStartTimeFilterChange} />
                </Descriptions.Item>
                <Descriptions.Item label="截止日期">
                    <RangePicker allowClear placeholder={['开始时间', '结束时间']} onChange={this.onEndTimeFilterChange} />
                </Descriptions.Item>
            </Descriptions>
        )
    }

    renderIssueTable = () => {
        const { currentIssues, users } = this.state;
        return (
            <Table className="issueList" dataSource={currentIssues}
                columns={getIssueColumns(this.getUserNameById, this.handleMarkComplete, this.handleMoveToNextStep,
                    this.handleDeleteIssue, this.currentUserId, isAdmin(users, this.currentUserId))}
                rowClassName={ record => 'table-row-status' + record.completeStatus }
                expandable={{
                    expandedRowRender: record => (
                        <Descriptions title={record.issueName} column={3}>
                            <Descriptions.Item label='负责人'>{this.getUserNameById(record.ownerId)}</Descriptions.Item>
                            <Descriptions.Item label='案件对象'>{record.targetName}</Descriptions.Item>
                            <Descriptions.Item label='案件状态'>{record.status === -1 ? '已完成': ISSUE_ACTIONS[record.action].steps[record.status].name}</Descriptions.Item>
                            <Descriptions.Item label='采取措施'>{ISSUE_ACTIONS[record.action].name}</Descriptions.Item>
                            <Descriptions.Item label='登记日期'>{new Date(record.startTime).toLocaleDateString()}</Descriptions.Item>
                            {
                                record.status === -1 ?
                                <Descriptions.Item label='完成日期'>{new Date(record.completeTime).toLocaleDateString()}</Descriptions.Item> :
                                <Descriptions.Item label='截止日期'>{new Date(record.endTime).toLocaleDateString()}</Descriptions.Item>
                            }
                            
                            <Descriptions.Item label='备注' span={3}>{record.details}</Descriptions.Item>
                        </Descriptions>
                    )
                }}
            />
        )
    }

    renderIssueModal = () => {
        const { issueModalVisible, users } = this.state
        const currentUser = getById(users, this.currentUserId) || {}
        const availableActions = getAvailableActions(users, this.currentUserId)
        return (
            <Modal closable={false} className="issueModal" title={'添加新案件'} visible={issueModalVisible} footer={null}>
                <Form ref={this.issueFormRef} labelCol={{span: 5}} wrapperCol={{span: 15}} initialValues={{
                    issueName: '',
                    targetName: '',
                    action: (availableActions.length > 0 && availableActions[0].value) || 0,
                    startTime: moment(),
                    details: ''
                }}>
                    <Form.Item label="案件名称：" name="issueName" rules={[{
                        required: true,
                        message: MESSAGE.EmptyIssueName
                    }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="负责人">{currentUser.name}</Form.Item>
                    <Form.Item label="案件对象" name="targetName" rules={[{
                        required: true,
                        message: '案件对象不能为空！'
                    }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="采取措施" name="action">
                        <Select>
                            {getOptions(availableActions, false)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="登记时间" name="startTime">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="备注" name="details">
                        <TextArea />
                    </Form.Item>
                    <Form.Item className="buttons" wrapperCol={{offset: 5, span: 15}}>
                        <Button type="primary" htmlType="submit" onClick={this.handleCreateIssue}>创建</Button>
                        <Button htmlType="button" onClick={this.handleCancelIssue}>取消</Button>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    render() {
        const { currentIssues, users } = this.state
        if (users.length === 0) {
            return null
        }
        return (
            <>
                <TitleBar isHome={true} showUserManagement={true} currentUserId={this.currentUserId} userList={users} />
                <div className="main">
                    { this.renderSummary() }
                    <div className="header">
                        <div>案件列表</div>
                        <div className="total">
                            <span>{`当前显示${currentIssues.length}个案件`}</span>
                            <Button type="primary" shape="round" icon={<PlusOutlined />} onClick={ this.openIssueEditor }>添加新案件</Button>
                        </div>
                    </div>
                    { this.renderFilterSection() }
                    { this.renderIssueTable() }
                </div>
                { this.renderIssueModal() }
            </>
        )
    }
}

export default Home
