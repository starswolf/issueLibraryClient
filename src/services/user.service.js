import axios from "axios";
import { ISSUE_TYPE, USER_TYPE } from "../utils/constants";
import { getAPIURL, isEmpty } from "../utils/helper";
// import { userList } from "../utils/mockData";
import { MESSAGE } from "../utils/strings";
import authHeader from "./auth-header";
import { handleRedirect } from "./requestHelper";

const USER_URL = getAPIURL + 'user'

// const allUsers = userList

export async function createUser(name = '', pwd = '', type = USER_TYPE.NORMAL, privilege = ISSUE_TYPE.NONE) {
    // return axios.post(USER_URL, { name, pwd, privilege }, { headers: authHeader() })
    try {
        if (isEmpty(name)) {
            return Promise.reject(MESSAGE.EmptyUserName)
        }
        if (isEmpty(pwd)) {
            return Promise.reject(MESSAGE.EmptyPassword)
        }
        // const index = allUsers.findIndex(user => user.name.toLowerCase() === name.toLowerCase())
        // if (index >= 0) {
        //     return Promise.reject(MESSAGE.DuplicateName)
        // }
        // const newId = allUsers[allUsers.length - 1].id + 1
        // allUsers.push({ id: newId, name, pwd, type, privilege})
        // return Promise.resolve(MESSAGE.CreateUserSuccess.replace('#', name))
        await axios.post(USER_URL, {
            name,
            pwd,
            type,
            privilege
        }, {
            headers: authHeader()
        })
        return '创建用户成功！'
    } catch(err) {
        handleRedirect(err, '创建用户失败，请刷新后重新尝试！')
    }
}

export async function updateUser(id = -1, name = '', pwd = '', type = USER_TYPE.NORMAL, privilege = ISSUE_TYPE.NONE) {
    // return axios.put(USER_URL + id, { name, pwd, privilege }, { headers: authHeader() })
    try {
        if (id === -1) {
            return Promise.reject(MESSAGE.UnknownError)
        }
        if (isEmpty(name)) {
            return Promise.reject(MESSAGE.EmptyUserName)
        }
        // let index = allUsers.findIndex(user => user.name.toLowerCase() === name.toLowerCase() && user.id !== id)
        // if (index >= 0) {
        //     return Promise.reject(MESSAGE.DuplicateName)
        // }
        // index = allUsers.findIndex(user => user.id === id)
        // if (index < 0) {
        //     return Promise.reject(MESSAGE.UnknownError)
        // }
        let userObj = { name, type, privilege}
        if (pwd !== '') {
            userObj.pwd = pwd
            // 密码为空表示不需要更新密码
        }
        // allUsers[index] = {id, name, pwd, type, privilege}
        // return Promise.resolve(MESSAGE.UpdateUserSuccess.replace('#', name))
        await axios.put(USER_URL + '/' + id, userObj, { headers: authHeader() })
        return '更新用户信息成功！'
    } catch(err) {
        handleRedirect(err, '更新用户失败，请刷新后重新尝试！')
    }
}

export async function updatePwd(id = -1, oldPwd = '', newPwd = '') {
    try {
        if (id === -1) {
            return Promise.reject(MESSAGE.UnknownError)
        }
        if (isEmpty(oldPwd)) {
            return Promise.reject(MESSAGE.EmptyOldPassword)
        }
        if (isEmpty(newPwd)) {
            return Promise.reject(MESSAGE.EmptyNewPassword)
        }
        // let index = allUsers.findIndex(user => user.id === id)
        // if (index < 0) {
        //     return Promise.reject(MESSAGE.UnknownError)
        // }
        // if (allUsers[index].pwd !== oldPwd) {
        //     return Promise.reject(MESSAGE.IncorrectOldPassword)
        // }
        // allUsers[index].pwd = newPwd
        // return Promise.resolve(MESSAGE.UpdatePwdSuccess)
        await axios.put(USER_URL + '/updatePwd/' + id, {
            oldPwd,
            newPwd
        }, { headers: authHeader() })
        return '更改密码成功!'
    } catch(err) {
        handleRedirect(err, '更改密码失败，请刷新后重新尝试！')
    }
}

export async function getAllUsers() {
    try {
        const res = await axios.get(USER_URL, { headers: authHeader() })
        return res && res.data && res.data.users || []
    } catch(err) {
        handleRedirect(err, '获取用户列表失败，请刷新页面重新尝试或联系管理员重启服务器！')
    }

    // allUsers.map(user => user.key = user.id)
    // return Promise.resolve(allUsers)
}

export async function deleteUser(id) {
    try {
        const res = await axios.delete(USER_URL + '/' + id, { headers: authHeader() })
        return '删除用户成功'
    } catch(err) {
        handleRedirect(err, '删除用户失败，请刷新后重新尝试！')
    }
    // const index = allUsers.findIndex(user => user.id === id)
    // if (index < 0) {
    //     return Promise.reject(MESSAGE.UnknownError)
    // }
    // const name = allUsers[index].name
    // allUsers.splice(index, 1)
    // return Promise.resolve(MESSAGE.DeleteUserSuccess.replace('#', name))
}