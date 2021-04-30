/* eslint-disable no-unused-vars */
import $ from 'jquery'
import { deJson } from '../components/util'
import apiUrl from '../components/apiUrl'


/**
 * ajax过滤器
 * do 为入口方法
 * filter_1, filter_2, filter_3 根据状态码进行声明
 */
const AjaxFilter = {}
AjaxFilter.do = function () {

    let params = Array.from(arguments)
    let status = Math.abs(params.shift())
    let fnName = `filter_${status}`

    if (typeof this[fnName] === 'function') {
        AjaxFilter[fnName].apply(this, params)
    }
}


/**
 * 管理员权限，需要二次认证
 * 重定向到认证界面
 */
AjaxFilter.filter_3 = function (vm, msg, realMsg) {

    vm.notify.error(realMsg)
    vm.$router.push({
        name: 'confirm'
    })
}


/**
 * 未登录，要求登录，重定向到SSO
 */
AjaxFilter.filter_2 = function (vm, msg, realMsg) {

    vm.notify.error(realMsg)
    let url = `${apiUrl.LOGIN_SSO}?serve=${apiUrl.BASE}`
    window.location.replace(url)
}


function init (vm) {

    $.ajaxSetup({

        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
    
        success: (ori) => {
    
            const {realMsg, status, msg, data} = deJson(ori)
            AjaxFilter.do(status, vm, msg, realMsg, data)
        }
    })
}

export default init