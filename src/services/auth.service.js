import axios from 'axios'
import { getAPIURL } from '../utils/helper'
import { handleRedirect } from './requestHelper'

const AUTH_URL = getAPIURL + 'auth/'

export async function login(name, pwd) {
    try {
        const res = await axios.post(AUTH_URL + 'login', { name, pwd })
        if (res && res.data && res.data.accessToken) {
            localStorage.setItem('user', JSON.stringify(res.data))
            return res && res.data
        }
        throw Object.assign(new Error(''), { code: -1, msg: '未知服务器错误，请联系管理员重启服务器！'})
    } catch (ex) {
        throw ex
    }
}

export async function logout() {
    localStorage.removeItem('user')
    try {
        await axios.post(AUTH_URL + 'logout')
    } catch(err) {
        handleRedirect(err, '成功登出！')
    }
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user')) || {}
}
