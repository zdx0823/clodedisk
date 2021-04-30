<template>
  <div class="w-full h-full flex justify-center items-center">
      <div class="
        w-96 h-36 mx-auto 
        flex flex-col justify-between
        px-10 py-3
        border-gray-300 border border-solid
        rounded-md
        bg-white
        shadow-md
    ">
        <!-- 头 -->
        <div class="text-center text-gray-900 text-sm">请输入邮箱验证码</div>

        <div>
            <div class="mb-4">
                <el-input v-model="code" size="mini" />
            </div>

            <!-- 按钮 -->
            <div class="flex justify-end px-5">
                <el-button size="mini" :type="sendBtnType" @click="sendCode">{{sendBtnLabel}}</el-button>
                <el-button size="mini" :type="submitBtnType" @click="submit">{{submitBtnLabel}}</el-button>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
import $ from 'jquery'
import apiUrl from './apiUrl';
import {deJson, notify} from './util'


/**
 * 发送验证码请求
 * 1. 发送请求，禁止重复发送
 * 2. 按钮设置为不可用，按钮开始倒计时
 * 3. 反馈结果
 */
class SEND_CODE {

    constructor () {

        this.timer = null
        this.curCount = 0
    }


    disableBtnCss () {

        this.vm.sendBtnType = 'info'
    }


    usableBtnCss () {

        this.vm.sendBtnType = 'primary'
    }


    send () {
        
        $.post(apiUrl.SEND_CODE).then(res => {
            const {status, msg, realMsg} = deJson(res)

            if (status === 1) return this.vm.notify.succ(msg)

            return this.vm.notify.error(realMsg)
        })

        this.disableBtnCss()
        this.curCount = SEND_CODE.timeout
        this.vm.sendBtnLabel = `${SEND_CODE.BTN_LABEL} (${SEND_CODE.timeout})`
        this.timer = setInterval(() => {

            let n = this.curCount - 1
            this.curCount = n

            if (n === 0) {

                this.usableBtnCss()
                clearInterval(this.timer)
                this.vm.sendBtnLabel = SEND_CODE.BTN_LABEL
                this.timer = null
                return
            }

            let label = `${SEND_CODE.BTN_LABEL} (${n})`
            this.vm.sendBtnLabel = label
        }, 1000)
    }


    do (vm) {

        if (this.timer != null) {
            vm.notify.error(SEND_CODE.SEND_NOTICE)
            return
        }

        this.vm = vm
        this.send()
    }

}
SEND_CODE.timeout = 60
SEND_CODE.BTN_LABEL = '发送验证码'
SEND_CODE.SEND_NOTICE = '验证码已发送，请勿重复操作'
SEND_CODE.SEND_SUCC = '验证码已发送，请到邮箱查看'


/**
 * 发送核实验证码请求
 * 1. 发送请求，禁止重复发送
 * 2. 按钮样式改为不可用状态
 * 3. 根据返回结果决定是否重定向回首页
 */
class SUBMIT_CODE {

    constructor () {
        this.sending = false
    }

    disableBtnCss () {

        this.vm.submitBtnLabel = '正在验证...'
        this.vm.submitBtnType = 'info'
    }

    usableBtnCss () {

        this.vm.submitBtnLabel = '确定'
        this.vm.submitBtnType = 'success'
    }

    submit (succ) {

        let code = this.vm.code
        if (code.length === 0) {
            this.vm.notify.error(SUBMIT_CODE.CODE_VAL_ERR)
            return
        }

        this.sending = true
        this.disableBtnCss()
        $.post(apiUrl.CONFIRM_CODE, {code}).then(res => {

            const {realMsg, status} = deJson(res)
            if (status !== 1) {
                this.vm.notify.error(realMsg)
                this.sending = false
                this.usableBtnCss()
                return
            }

            succ()
            this.sending = false
            this.usableBtnCss()
        })
    }

    do (vm, succ = () => {}) {

        this.vm = vm
        this.submit(succ)
    }
}
SUBMIT_CODE.CODE_VAL_ERR = '验证码不能为空'


const sendCode = new SEND_CODE()
const submitCode = new SUBMIT_CODE()
export default {
    name: 'Confirm',
    data: () => ({
        code: '',
        sendBtnLabel: '发送验证码',
        sendBtnType: 'primary',
        submitBtnType: 'success',
        submitBtnLabel: '确定',
    }),
    methods: {
        sendCode () {
            
            sendCode.do(this)
        },

        submit () {
            
            submitCode.do(this, () => {
                this.$router.push({
                    name: 'index'
                })
            })
        }
    },
    mounted () {
        this.notify = notify(this)
    }
}
</script>

<style>

</style>