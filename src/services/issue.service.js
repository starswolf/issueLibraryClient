import axios from "axios";
import { getAPIURL, isEmpty } from "../utils/helper";
// import { getRandomIssue } from "../utils/mockData";
import { MESSAGE } from "../utils/strings";
import authHeader from "./auth-header";
import { handleRedirect } from "./requestHelper";

const ISSUE_URL = getAPIURL + 'issue'

// const allIssues = getRandomIssue()

export async function createIssue(issueName, action, targetName, ownerId, status, startTime, details) {
    try {
        if (isEmpty(issueName)) {
            return Promise.reject(MESSAGE.EmptyIssueName)
        }
        if (isEmpty(targetName)) {
            return Promise.reject(MESSAGE.EmptyIssueTarget)
        }
        // const newId = allIssues[allIssues.length - 1].id + 1
        // allIssues.push({ id: newId, issueName, action, targetName, ownerId, status, startTimeArr: [startTime], completeTime: null, details})
        // return Promise.resolve(MESSAGE.CreateIssueSuccess.replace('#', issueName))
        await axios.post(ISSUE_URL, {
            issueName,
            action,
            targetName,
            ownerId,
            status,
            startTimeArr: [startTime],
            endTime: null,
            details
        }, {
            headers: authHeader()
        })
        return '添加案件成功！'
    } catch (err) {
        handleRedirect(err, '添加案件失败，请刷新后重试！')
    }
}

export async function updateIssue(id = -1, issueName, action, targetName, ownerId, status, startTimeArr, completeTime, details) {
    try {
        if (id === -1) {
            return Promise.reject(MESSAGE.UnknownError)
        }
        if (isEmpty(issueName)) {
            return Promise.reject(MESSAGE.EmptyIssueName)
        }
        if (isEmpty(targetName)) {
            return Promise.reject(MESSAGE.EmptyIssueTarget)
        }
        // let index = allIssues.findIndex(issue => issue.id === id)
        // if (index < 0) {
        //     return Promise.reject(MESSAGE.UnknownError)
        // }
        // allIssues[index] = { id, issueName, action, targetName, ownerId, status, startTimeArr, completeTime, details }
        // return Promise.resolve(MESSAGE.UpdateIssueSuccess.replace('#', issueName))
        await axios.put(ISSUE_URL + '/' + id, {
            issueName,
            action,
            targetName,
            ownerId,
            status,
            startTimeArr,
            completeTime,
            details
        }, {
            headers: authHeader()
        })
        return '更新案件成功！'
    } catch (err) {
        handleRedirect(err, '更新案件失败，请刷新后重试！')
    }
}

export async function getAllIssues() {
    // return Promise.resolve(allIssues)
    try {
        const res = await axios.get(ISSUE_URL, { headers: authHeader() })
        return res && res.data && res.data.issues || []
    } catch (err) {
        handleRedirect(err, '获取案件列表失败，请刷新页面重新尝试或联系管理员重启服务器！')
    }
}

export async function deleteIssue(id) {
    // const index = allIssues.findIndex(issue => issue.id === id)
    // if (index < 0) {
    //     return Promise.reject(MESSAGE.UnknownError)
    // }
    // const name = allIssues[index].issueName
    // allIssues.splice(index, 1)
    // return Promise.resolve(MESSAGE.DeleteIssueSuccess.replace('#', name))
    try {
        await axios.delete(ISSUE_URL + '/' + id, { headers: authHeader() })
        return '删除案件成功！'
    } catch (err) {
        handleRedirect(err, '删除案件失败，请刷新后重新尝试!')
    }
}