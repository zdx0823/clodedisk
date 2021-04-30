import $ from 'jquery'
window.$ = $
require('jquery.cookie')
const URIJS = require('urijs')
import { deJson } from '../components/util'
import apiUrl from '../components/apiUrl'


/**
 * 验证用户是否登录
 * 1. 每次刷新都会重新发送请求验证
 * 2. 已登录，下一步
 * 3. 未登录，验证ST
 * 3-1. ST可用，重定向回本页面，ST不可用重定向到SSO
 */
class Auth {

    constructor () {
        this.isChecked = false
    }


    /**
     * 出口方法
     */
    check (next) {

        if (this.isChecked === true) return next()

        this.isChecked = true
        this.checkLogin().then(res => {

        if (res) return next()

        // 未登录，ST是否可用，没有跳转到sso
        this.checkSt().then(res => {

            window.location.replace(res)
        })
        })
    }


    checkLogin () {

        return $.post(apiUrl.CHECK_LOGIN).then(res => {

        const {status} = deJson(res)
        return !!(status === 1)
        })
    }


    checkSt () {

        const urijs = URIJS(window.location.href)
        const query = urijs.search(true)
        const st = query.st

        if (!st) {

        let uri = `${apiUrl.LOGIN_SSO}?serve=${apiUrl.BASE}`
        return Promise.resolve(uri)
        }


        return $.post(apiUrl.CHECK_ST, { st }).then(res => {
        console.log(1111);
        const {status} = deJson(res)
        if (status === 1) {

            delete query.st
            let uri = urijs.search(query).toString()
            return uri
        }

        let uri = `${apiUrl.LOGIN_SSO}?serve=${apiUrl.BASE}`
        return uri
        })
    }


    isNeedConfirm (next) {

        $.post(apiUrl.IS_NEED_CONFIRM).then(res => {

            const {data} = deJson(res)
            const {isNeed} = data

            if (isNeed) return next()
            return next({
                name: 'index'
            })
        })
    }
}

export default new Auth()