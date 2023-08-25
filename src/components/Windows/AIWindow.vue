<template>
    <div class="ai-wrapper" v-drag>
        <div class="title">550W智能语音AI控制面板</div>
        <div class="ai-terminal">
            <el-scrollbar height="550px">
                <div v-for="i in aijson" class="ai-terminal-item">{{ i }}</div>
                <div v-for="(i, index) in lines" class="ai-terminal-item">
                    <span>{{ i.sender === 'moss' ? '550W >>>  ' : 'User >>>  ' }}</span>
                    {{ i.content }}
                    <span class="terminal-pointer" v-if="index === lines.length -1 && i.sender === 'user'">▂</span>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script lang='ts' setup>
import pubsub from 'pubsub-js'
import aijson from '@/config/ai.json'
import useSendQuestion from '@/hooks/ai/useSendQuestion';
import formatKey from '@/utils/formatKey';
import { onMounted, ref, type Ref } from 'vue';
import type { ServerAnswer, ServerFailed } from '@/config/interface/main';
import { isAuth } from '@/hooks/auth/useAuth';
import { addToSpeech, isSpeeking } from '@/hooks/ai/useSpeech';
import useRecognition from '@/hooks/ai/useRecognition';
import useFormatAnswer from '@/utils/useFormatAnswer';

const lines: Ref<{
    content: string,
    sender: 'user' | 'moss',
    failed?: boolean
}[]> = ref([{
    sender: 'user',
    content: ''
}])
let lastMsg = ''
let lastStatus = false
let isAuthing = false
let isAnswering = false
//激活语音条件：第一次问题需要带有"MOSS"人称，回答后10秒钟内的提问无需附带人称，10秒后依然需要
let isMossNeeded = true

const addLine = (key: string) => {
    if (key === 'Enter'){
        useSendQuestion(lines.value[lines.value.length -1].content)
        lines.value.push({
            sender: 'moss',
            content: ''
        })
    }else if (key === 'Backspace'){
        let str = lines.value[lines.value.length - 1].content
        return lines.value[lines.value.length - 1].content = str.slice(0, -1)
    }else{
        lines.value[lines.value.length - 1].content += key
    }
}


onMounted(() => {
    let is_flag = false
    addToSpeech('', true)
    addEventListener('keydown',(e) => {
        const key = formatKey(e)
        if (!isAuthing && key && lines.value[lines.value.length -1].sender === 'user'){
            addLine(key)
        }
    } )
    pubsub.subscribe('ai-data',(_, data: ServerAnswer | ServerFailed) => {
        isAnswering = true
        const line = lines.value[lines.value.length -1]
        //面板移动
        const el = document.querySelector('.ai-terminal .el-scrollbar__wrap')
        el?.scrollTo(0, el.scrollHeight)
        if (data.type === 'f'){
            //失败了
            line.failed = true
            line.content = data.msg
            // if (!isSpeeking()){
            //     addToSpeech(data.msg)
            // }
            addToSpeech(data.msg)
            is_flag = false
            lastMsg = data.msg
            lastStatus = true
            lines.value.push({
                sender: 'user',
                content: ''
            })
            isAnswering = false
        }else{
            line.failed = false
            line.content += data.a.replace(lastMsg, '')
            localStorage.setItem('did', data.did.toString())
            localStorage.setItem('cid', data.cid)
            localStorage.setItem('pid', data.pid.toString())
            if (data.is_f && !is_flag){
                addToSpeech(useFormatAnswer(data.a.replace(lastMsg, '')))
                is_flag = true
                lastMsg = data.a
                lastStatus = true
                lines.value.push({
                    sender: 'user',
                    content: ''
                })
                isAnswering = false
                //useRecognition(data.a)
            }else if (data.is_f && is_flag){ 
                return
            }else{
                is_flag = false
                isAnswering = true
                lastStatus ? addToSpeech(useFormatAnswer(data.a)) : addToSpeech(useFormatAnswer(data.a.replace(lastMsg, '')))
                lastMsg = data.a
                lastStatus = false
            }
        }
    })
    pubsub.subscribe('recognition-data',(_, data: string) => {
        if (!data) useRecognition(lastMsg)
        if (!isAnswering && !isSpeeking()){
            if (!isAuthing && isAuth()){
                if (lines.value[lines.value.length -1].sender !== 'user') return
                console.log(data)
                if (isMossNeeded){
                    console.log('is needed ?', isMossNeeded)
                    let _data = data.toLowerCase()
                    if (!_data.includes('moss') && !_data.includes('mos') && !_data.includes('莫斯') && !_data.includes('mouse')
                    && !_data.includes('mouth') && !_data.includes('month')){
                        return useRecognition(lastMsg)
                    }
                }
                //懒得优化了，看得懂就行
                //! 其实应该在后端prompt里面转换人称，但考虑到诸多因素就在前端手动替换了
                const question = data.replace('MOSS','').replace('MOSS,','').replace('MOSS，','')
                                .replace('Mos','').replace('Mos,','').replace('Mos，','')
                                .replace('Moss','').replace('Moss,','').replace('Moss，','')
                                .replace('moss','').replace('moss,','').replace('moss，','')
                                .replace('莫斯', '').replace('莫斯,', '').replace('莫斯，', '')
                                .replace('mouth','').replace('mouse','').replace('month','').replace('Mouth','')
                                .replace('Mouse','').replace('Month','').replace('Mouse,','').replace('Month,','')
                                .replace('Mouse，','').replace('Month，','').replace('mouse，','').replace('mouse,','')
                lines.value[lines.value.length -1].content = question
                useSendQuestion(question)
                lines.value.push({
                    sender: 'moss',
                    content: ''
                })
                isAnswering = true
            }
        }
    })
    pubsub.subscribe('speeking-finished',(_, data: number) => {
        useRecognition(lastMsg)
        if (data){
            //参数传递为1时指onend触发，此时计时10秒钟调整MOSS人称需求
            isMossNeeded = false
            setTimeout(() => {
                isMossNeeded = true
            }, 16000)
        }
    })
})

</script>

<style lang='less' scoped>
.ai-wrapper{
    position: absolute;
    left: 20%;
    top: calc(50% - 300px);
    width: 60%;
    height: 600px;
    z-index: 2100;
    background-color: rgb(33, 45, 43);
    animation: showWindow 0.4s;
    .title{
        position: relative;
        top: 0;
        left: 0;
        width: calc(100% - 30px);
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: 18px;
        color: white;
        border-bottom: 3px solid orange;
    }
    .ai-terminal{
        position: relative;
        left: 0;
        width: 100%;
        top: 0;
        height: 550px;
        padding: 10px;
        overflow: hidden;
        .ai-terminal-item{
            position: relative;
            color: white;
            font-family:'Courier New', Courier, monospace;
            font-size: 16px;
            margin: 4px 0;
            width: calc(100% - 10px);
            .terminal-pointer{
                animation: fade 1s infinite;
            }
        }
    }
}
</style>