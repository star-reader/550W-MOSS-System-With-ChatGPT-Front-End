<template>
    <div class="terminal-wrapper" id="terminal-main">
        <div v-for="(i, index) in lines"
        :is-last="index === lines.length - 1"
         class="terminal-info-item">{{ i }}
            <span class="terminal-pointer">▂</span>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { onMounted , nextTick, ref, type Ref } from 'vue';
import terminalInfo from '@/config/terminal.json'
import pubsub from 'pubsub-js'
import formatKey from '@/utils/formatKey'
import useSendTerminalEvent from '@/hooks/terminal/useSendTerminalEvent'

const lines: Ref<string[]> = ref([])
let isAuthing = false
let isChatting = false

const addToLine = (e: KeyboardEvent) => {
    const key = formatKey(e)
    if (!key) return
    if (key === 'Enter'){
        const d = useSendTerminalEvent(lines.value[lines.value.length -1].toUpperCase())
        lines.value.push('root@550w:~# ' + d)
        return lines.value.push('root@550w:~# ')
    }
    if (key === 'Backspace'){
        //删除一个文字
        let str = lines.value[lines.value.length - 1]
        return lines.value[lines.value.length - 1] = str.slice(0, -1)
    }
    lines.value[lines.value.length - 1] += key
}

onMounted(() => {
    //terminalInfo.forEach(i => lines.value.push(i))
    terminalInfo.forEach(i => {
        setTimeout(() => {
            lines.value.push(i)
        }, 500);
    })
    addEventListener('keydown', (e: KeyboardEvent) => {
        if (isAuthing) return
        addToLine(e)
    })
    nextTick(() => {
        //document.getElementById('hidden-input')?.focus()
    })
    pubsub.subscribe('start-auth',() => isAuthing = true)
    pubsub.subscribe('close-auth',() => isAuthing = false)
    pubsub.subscribe('request-init-ai',() => { isChatting = true })
})

</script>

<style lang='less' scoped>
.terminal-wrapper{
    position: relative;
    top: 0;
    height: calc(100% - 55px);
    left: 0;
    width: 100%;
    background-color: rgb(34,47,45);
    padding: 0 15px;
    cursor:text ;
    .terminal-info-item{
        color: aliceblue;
        font-size: 18px;
        line-height: 22px;
        margin: 5px 0;
        span{
            display: none;
            transition-duration: 0s;
            animation: fade 1s infinite;
            user-select: none;
        }
        &[is-last = 'true']{
            span{
                display: inline;
            }
        }
    }
}

</style>