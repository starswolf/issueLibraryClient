import moment from 'moment';
import { USER_TYPE } from "./constants";
import { getUserPrivielgeValues } from "./helper";

export function getUserModel(user) {
    if (!user) {
        user = {}
    }
    return {
        username: user.name || '',
        password: '',
        type: user.type || USER_TYPE.NORMAL,
        privilege: getUserPrivielgeValues(user.privilege)
    }
}

export function getIssueModel(issue) {
    if (!issue) {
        issue = {}
    }
    return {
        issueName: issue.issueName || '',
        targetName: issue.targetName || '',
        issueAction: issue.action || 0,
        status: issue.status || 0,
        startTime: moment((issue.startTimeArr && issue.startTimeArr[0])) || moment(),
        details: issue.details || ''
    }
}

export function getPwdModel() {
    return {
        oldPwd: '',
        newPwd: '',
        confirm: ''
    }
}