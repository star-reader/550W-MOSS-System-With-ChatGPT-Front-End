<template>
    <div class="main-background global-screen">
        <div class="left-tree">
            <div class="title">资源管理器</div>
            <div class="split"></div>
            <!-- <div class="ueg-warning-weak">文件受UEG保护</div> -->
            <div class="folder-tree">
                <div v-for="i in folder" 
                :folder-type="i.is_folder" 
                :root-type="i.is_root"
                class="tree-item">{{ i.name }}</div>
            </div>
        </div>
        <div class="terminal">
            <TopBasicNav />
            <BasicTerminal />
        </div>
        <IndependentWindow
        v-if="isShowPanel"
        left="200px"
        top="80px"
        :layer="2"
        page="自编译" />
        <IndependentWindow
        v-if="isShowPanel"
        left="700px"
        top="100px"
        :layer="1"
        page="自组织" />
        <IndependentWindow
        v-if="isShowPanel"
        left="240px"
        top="450px"
        :layer="3"
        page="自适应" />
        <Authorization v-if="isShowAuth" />
        <AIWindow v-if="isShowAI" />
        <ActionResultVue v-if="isShowInitResult" text="系统与本地握手成功" :status="true" />
    </div>
    
</template>

<script lang='ts' setup>
import pubsub from 'pubsub-js'
import { onMounted, ref } from 'vue'
import TopBasicNav from '@/components/NavBar/TopBasicNav.vue'
import BasicTerminal from '@/components/Terminal/BasicTerminal.vue'
import folder from '@/config/folder.json'
import IndependentWindow from '@/components/Windows/IndependentWindow.vue'
import Authorization from '@/components/Windows/Authorization.vue'
import AIWindow from '@/components/Windows/AIWindow.vue'
import ActionResultVue from '@/components/Windows/ActionResult.vue'
import { setWebSocket } from '@/hooks/ai/useWebSocket'

const isShowPanel = ref(false)
const isShowAuth = ref(false)
const isShowAI = ref(false)
const isShowInitResult = ref(false)
let initCount = 0

onMounted(() => {
    setTimeout(() => {
        isShowAuth.value = true
        pubsub.publish('start-auth',1)
    }, 1500)
    pubsub.subscribe('close-auth', () => {
        isShowAuth.value = false
        setTimeout(() => {
            isShowPanel.value = true
        }, 200);
    })
    pubsub.subscribe('init-loading-finish', () => {
        initCount++
        if (initCount === 3){
            //全部加载成功
            setTimeout(() => {
                isShowInitResult.value = true
            }, 230)
            setTimeout(() => {
                isShowInitResult.value = false
                pubsub.publish('init-loading-over',1)
            }, 2500)
            // setTimeout(() => {
            //     isShowPanel.value = false
            // }, 5500);
        }
    })
    pubsub.subscribe('request-init-ai',() => {
        if (!isShowAI.value){
            setWebSocket()
        }
        isShowAI.value = true
    })
})
</script>

<style lang='less' scoped>
@leftWidth: 350px;
.main-background{
    display: flex;
}
.left-tree{
    position: absolute;
    left: 0;
    top: 0;
    width: @leftWidth;
    height: 100%;
    background-color: rgb(26,38,36);
    color: aliceblue;
    padding: 18px 10px;
    text-align: center;
    user-select: none;
    .title{
        position: relative;
        font-size: 26px;
        color: orange;
    }
    .split{
        position: relative;
        margin-left: 0;
        margin-top: 5px;
        width: 100%;
        height: 2px;
        background-color: gray;
    }
    .folder-tree{
        position: relative;
        overflow: auto;
        text-align: left;
        color: white;
        height: calc(100% - 60px);
        .tree-item{
            font-size: 18px;
            margin: 4px 0;
            padding-left: 35px;
            cursor: pointer;
            transition-duration: 0.4s;
            &:hover{
                background-color: rgb(103, 100, 100);
            }
            &[folder-type = true]{
                padding-left: 12px;
            }
            &[root-type = true]{
                padding-left: 8px;
                font-weight: bold;
                color: rgb(232, 213, 143);
            }
        }
    }
}
.terminal{
    position: absolute;
    left: @leftWidth;
    right: 0;
    top: 0;
    height: 100%;
    background-color: rgb(34, 47, 45);
}
</style>