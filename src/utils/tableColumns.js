import { DeleteOutlined, EditOutlined, CheckOutlined, ArrowRightOutlined } from "@ant-design/icons"
import { Button, Space, Tag, Tooltip } from "antd"
import { ISSUE_ACTIONS, ISSUE_TYPE } from "./constants"
import { checkPrivilege, getUserPrivielgeText } from "./helper"
import { TEXT_USER_TYPE } from "./strings"

export function getUserColumns(fnEditUser, fnDeleteUser, curUserId) {
    return [
        { title: '用户名', dataIndex: 'name', key: 'name', ellipsis: true, render: (text) => (
            <Tooltip title={text}>{text}</Tooltip>
        ) },
        { title: '用户类型', dataIndex: 'type', key: 'type', width: 150, render: val => TEXT_USER_TYPE[val] },
        { title: '用户权限', dataIndex: 'privilege', key: 'privilege', width: 200, render: (_, record) => (
            <>
                {
                    checkPrivilege(record.privilege, ISSUE_TYPE.XingShi) &&
                    <Tag color="red">{getUserPrivielgeText(ISSUE_TYPE.XingShi)}</Tag>
                }
                {
                    checkPrivilege(record.privilege, ISSUE_TYPE.XingZheng) &&
                    <Tag color="blue">{getUserPrivielgeText(ISSUE_TYPE.XingZheng)}</Tag>
                }
            </>
        )},
        { title: '操作', key: 'action', width: 150, render: (_, record) => (
            <Space>
                <Button icon={<EditOutlined />} shape="cicle" type="text" onClick={e => fnEditUser(record.id)} />
                {
                    record.id !== curUserId &&
                    <Button danger icon={<DeleteOutlined />} shape="circle" type="text" onClick={e => fnDeleteUser(record.id)} />
                }
            </Space>
        )}
    ]
}

export function getIssueColumns(fnGetUserName, fnMarkComplete, fnMovetoNextStep, fnDeleteIssue, curUserId, isAdmin = false) {
    return [
        { title: '案件名称', dataIndex: 'issueName', key: 'issueName' },
        { title: '负责人', width: 120, dataIndex: 'ownerId', key: 'ownerId', render: (_, record) => (
            <span>{fnGetUserName(record.ownerId)}</span>
        )},
        { title: '采取措施', width: 120, dataIndex: 'action', key: 'action', render: (_, record) => (
            <span>{ISSUE_ACTIONS[record.action].name}</span>
        )},
        { title: '状态', width: 180, dataIndex: 'issueStatus', key: 'issueStatus', render: (_, record) => (
            <span>{
                record.status === -1 ? '已完成' : ISSUE_ACTIONS[record.action].steps[record.status].name
            }</span>
        )},
        { title: '截止日期', width: 120, dataIndex: 'endTime', key: 'endTime', sorter: (a, b) => a.endTime - b.endTime, render: (_, record) => (
            <span>{
                record.status === -1 ? '' : new Date(record.endTime).toLocaleDateString()
            }</span>
        )},
        { title: '操作', width: 200, key: 'action', render: (_, record) => (

            (isAdmin || record.ownerId === curUserId) &&
            <Space>
                {
                    record.status !== -1 &&
                    <Tooltip title="标记完成">
                        <Button icon={<CheckOutlined style={{color: 'green'}} />} shape="circle" type="text" onClick={e => fnMarkComplete(record.id)} />
                    </Tooltip>
                }
                {
                    record.status !== -1 && record.status < ISSUE_ACTIONS[record.action].steps.length - 1 &&
                    <Tooltip title={'转到 ' + ISSUE_ACTIONS[record.action].steps[record.status + 1].name}>
                        <Button icon={<ArrowRightOutlined />} shape="circle" type="text" onClick={e => fnMovetoNextStep(record.id)} />
                    </Tooltip>
                }
                <Tooltip title="删除">
                    <Button danger icon={<DeleteOutlined />} shape="circle" type="text" onClick={e => fnDeleteIssue(record.id)} />
                </Tooltip>
            </Space>
        )}
    ]
}
