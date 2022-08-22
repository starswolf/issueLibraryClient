import { Select } from "antd"
import { OPTION_ALL, ISSUE_TYPE, ISSUE_COMPLETE_STATUS, ISSUE_ACTIONS, USER_TYPE } from "./constants"
import { TEXT_ALL } from "./strings"

const { Option } = Select

export const getAPIURL = window.location.origin + '/api/'

export function getOptions(itemList = [], hasAll = true, extraInfo = null) {
    const result = []
    if (hasAll) {
        result.push(<Option key={OPTION_ALL} value={OPTION_ALL}>{TEXT_ALL}</Option>)
    }
    itemList.forEach((item, index) => {
        const name = item.name || item;
        result.push(<Option key={name} value={item.value || index}>{name}</Option>)
    })
    if (extraInfo && extraInfo.name && extraInfo.value) {
        result.push(<Option key={extraInfo.name} value={extraInfo.value}>{extraInfo.name}</Option>)
    }
    return result
}

export function getUserPrivielgeText(privilege) {
    switch (privilege) {
        case ISSUE_TYPE.XingZheng:
            return '行政案件'
        case ISSUE_TYPE.XingShi:
            return '刑事案件'
        default:
            return ''
    }
}

export function checkPrivilege(privilege, target) {
    return (privilege & target) === target
}

export function getUserPrivielgeValues(privilege) {
    const values = []
    if (checkPrivilege(privilege, ISSUE_TYPE.XingShi)) {
        values.push(ISSUE_TYPE.XingShi)
    }
    if (checkPrivilege(privilege, ISSUE_TYPE.XingZheng)) {
        values.push(ISSUE_TYPE.XingZheng)
    }
    return values
}

export function getIssueType(issue) {
    return ISSUE_ACTIONS[issue.action].type
}

export function isAdmin(userList = [], id = '') {
    const user = getById(userList, id)
    return user && user.type === USER_TYPE.ADMIN
}

export function getSum(arr = []) {
    if (!arr.forEach) {
        arr = []
    }
    let sum = 0
    arr.forEach(e => sum += e)
    return sum
}

export function getById(arr = [], id) {
    return arr.find(obj => obj.id === id)
}

export function isEmpty(str = '') {
    return str.trim().length === 0
}

export function getToday() {
    return new Date().setHours(0, 0, 0, 0)
}

function getEndTime(startTime, timeStr) {
    const timeArr = timeStr.split(' ')
    const endTime = new Date(startTime)
    const currentDate = endTime.getDate()
    const interval = parseInt(timeArr[0], 10)
    if (timeArr[1] === 'D') {
        endTime.setDate(currentDate + interval)
    } else {
        endTime.setMonth(endTime.getMonth() + interval)
        if (endTime.getDate() !== currentDate) {
            endTime.setDate(0)
        }
    }
    endTime.setDate(endTime.getDate() - 1)
    return endTime.getTime()
}

function isTimeOut(startTime, timeStr) {
    return getEndTime(startTime, timeStr) <= getToday()
}

export function getIssueCompleteStatus(issue) {
    if (issue.status === -1) {
        return ISSUE_COMPLETE_STATUS.Complete
    }
    const { totalTime, timeToOrange, timeToRed } = ISSUE_ACTIONS[issue.action].steps[issue.status]
    const startTime = issue.startTimeArr[issue.status]
    if (isTimeOut(startTime, totalTime)) {
        return ISSUE_COMPLETE_STATUS.TimeOut
    } else if (isTimeOut(startTime, timeToRed)) {
        return ISSUE_COMPLETE_STATUS.RedRisk
    } else if (isTimeOut(startTime, timeToOrange)) {
        return ISSUE_COMPLETE_STATUS.OrangeRisk
    } else {
        return ISSUE_COMPLETE_STATUS.NoRisk
    }
}

export function getIssueEndTime(issue) {
    if (issue.status === -1) {
        return issue.completeTime
    }
    const { totalTime } = ISSUE_ACTIONS[issue.action].steps[issue.status]
    const startTime = issue.startTimeArr[issue.status]
    return getEndTime(startTime, totalTime)
}

export function getAvailableActions(userList = [], id = '') {
    const user = getById(userList, id)
    if (user) {
        return ISSUE_ACTIONS.filter(action => {
            return checkPrivilege(user.privilege, action.type)
        })
    }
    return []
}
