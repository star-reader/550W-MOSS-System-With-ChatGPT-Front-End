<template>
    <div class="auth-cover global-screen"></div>
    <div class="auth-wrapper">
        <div class="title">授权接口 | AUTHORIZATION INTERFACE</div>
        <div class="password-inter">
            <div v-for="i in passwordItem" class="password-item">
                {{ i }}
            </div>
        </div>
        <div class="data-text">
            <div v-for="i in authInfo" class="text-item">{{ i }}</div>
            <div class="text-item">您的本次登录ID: {{ random }}</div>
        </div>
    </div>
    <ActionResult v-if="isShowResult" 
    :text="isSuccess ? '系统授权成功' : '系统授权失败'" 
    :status="isSuccess" />
</template>

<script lang='ts' setup>
import { onMounted, ref, type Ref } from 'vue'
import pubsub from 'pubsub-js'
import ActionResult from './ActionResult.vue';
import authInfo from '@/config/authorization.json'
import getRandom from '@/utils/getRandom';
import formatKey from '@/utils/formatKey';
import { setAuth } from '@/hooks/auth/useAuth';
import useRecognition from '@/hooks/ai/useRecognition';


const passwordItem: Ref<string[]> = ref(Array.from({ length: 8 }, () => ""))
const isSuccess = ref(false)
const isShowResult = ref(false)
let passwordAct = ''
let password = ''
let random = ref('')

const generatePassword = () => {
    const r = getRandom(16)
    random.value = r
    //! passwordAct是实际的密码，由随机字符串r到生成密码的算法由用户手动确定
    passwordAct = ''
}

const verifyPassword = () => {
    //测试，都是true，实际中应该是true : false
    isSuccess.value = password.toUpperCase() === passwordAct ? true : false
    password = ''
    passwordItem.value = Array.from({ length: 8 }, () => "")
    isShowResult.value = true
    setTimeout(() => {
        isShowResult.value = false
        //在这里关闭授权模块
        if (isSuccess.value){
            pubsub.publish('close-auth',1)
            setAuth(true)
            useRecognition()
            //在这里激活语音识别和播放识别结果
        }else{
            setAuth(false)
        }
    }, 1400);
}

const addPassword = (key: string) => {
    if (key === 'Enter') return
    if (key === 'Backspace'){
        //删除一位密码
        password =  password.slice(0, -1)
        //显示效果
        // return passwordItem.value.forEach((i, index) => {
        //     if (i !== '*' && index !== 0){
        //         passwordItem.value[index - 1] = ''
        //     }
        // })
        for (let i in passwordItem.value){
            if (passwordItem.value[i] === '' && i !== '0'){
                passwordItem.value[parseInt(i) -1] = ''
                break
            }
        }
        return 
    }
    password += key
    for (let i in passwordItem.value){
        if (passwordItem.value[i] === ''){
            passwordItem.value[i] = '*'
            break
        }
    }
    if (password.length === 8){
        verifyPassword()
    }
}

onMounted(() => {
    generatePassword()
    addEventListener('keydown', e => {
        const key = formatKey(e)
        if (key) addPassword(key)
    })
})

</script>

<style lang='less' scoped>
.auth-cover{
    z-index: 9990;
}
.auth-wrapper{
    position: fixed;
    width: 700px;
    left: calc(50% - 350px);
    height: 260px;
    top: calc(50% - 130px);
    background-color: rgb(73, 82, 82);
    z-index: 9991;
    color: aliceblue;
    animation: showWindow 0.35s;
    user-select: none;
    .title{
        position: relative;
        height: 30px;
        font-size: 20px;
        line-height: 30px;
        padding-left: 20px;
        border-bottom: 3px solid orange
    }
    .password-inter{
        position: relative;
        height: 87.5px;
        border-bottom: 1px solid lightgray;
        display: flex;
        justify-content: left;
        .password-item{
            width: 87.5px;
            border-right: 1px solid gray;
            font-size: 70px;
            line-height: 87.5px;
            font-weight: bold;
            text-align: center;
            &:last-child{
                border-right: 0px;
            }
        }
    }
    .data-text{
        position: relative;
        height: 142.5px;
        .text-item{
            position: relative;
            margin: 5px 6px;
            color: aliceblue;
            font-size: 16px;
        }
    }
}
</style>