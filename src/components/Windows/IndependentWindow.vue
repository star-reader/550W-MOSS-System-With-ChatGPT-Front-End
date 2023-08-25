<template>
    <div class="window-interface" v-drag
    :style="{left: props.left, top: props.top, zIndex: `100${props.layer}`}"
    :window-layer="
        props.page === '自编译' ? 'compile' : props.page === '自感知' ? 'perception' :
        props.page === '自组织' ? 'organization' : 'adaptation'
    "
    >
        <div class="title">
            <div class="title-item" :target-page="props.page === '自编译'">自编译</div>
            <div class="title-item" :target-page="props.page === '自组织'">自组织</div>
            <div class="title-item" :target-page="props.page === '自适应'">自适应</div>
            <div class="title-item" :target-page="props.page === '自感知'">自感知</div>
        </div>
        <!-- 进度条 -->
        <div class="progress">
            <div class="inner-process"
            :style="{width: `calc(${progress}% - 16px)`}"></div>
            <div class="progress-num">{{ progress }}%</div>
        </div>
        
        <div v-if="props.page === '自组织'" class="main-frame">
            <img id="qu-bk" :src="quImage" alt="computer_organization">
        </div>
        <div v-else class="main-frame">
            <el-scrollbar height="270px">
                <div v-for="i in compileText" class="text-item">{{ i }}</div>
            </el-scrollbar>
        </div>
        <div v-if="isComplete && !isLoadingOver" class="result-interface">
            {{ 
                props.page === '自感知' ? '感知' : props.page === '自组织' ? '组织' :
                props.page === '自编译' ? '编译' : '适应'    
            }}完成
        </div>
    </div>
    
</template>

<script lang='ts' setup>
import pubsub from 'pubsub-js'
import compileJson from '@/config/independent/compile.json'
import adaptationJson from '@/config/independent/adaptation.json'
import getRandom from '@/utils/getRandom'
import { onMounted, ref, type Ref, watch } from 'vue'
import quImage from '@/assets/qu.png'

const props = defineProps<{
    left: string,
    top: string,
    layer: number
    page: '自编译' | '自组织' | '自适应' | '自感知' | ''
}>()

const compileText: Ref<string[]> = ref([])
const progress = ref(0)
const isComplete = ref(false)
const isLoadingOver = ref(false)

const generateCompileInfo = (isInit: boolean, type: 'compile' | 'adaptation') => {
    const element = document.querySelectorAll('.window-interface')
    let scrollWrap: Element | null
    element.forEach(el => {
        if (el.getAttribute('window-layer') === type) {
            scrollWrap = el.querySelector('.el-scrollbar__wrap')
        }
    })
    
    const json = type === 'compile' ? compileJson : adaptationJson
    if (isInit){
        setInterval(() => {
            compileText.value.push(json[compileText.value.length])
            scrollWrap?.scrollTo(0, scrollWrap.scrollHeight)
        }, 80)
    }else{
        if (type === 'compile'){
            const compileThing: string[] = []
            for (let i = 0; i < 116; i++){
                compileThing.push(`COMPILE INFO: SUCCESS UPDATE DEVICE ${i}, STATUS: OK, DEVICE ID IS: ${getRandom(16)}`)
            }
            setInterval(() => {
                compileText.value.push(compileThing[compileText.value.length - json.length])
                scrollWrap?.scrollTo(0, scrollWrap.scrollHeight)
            }, 40)
        }else {
            const compileThing: string[] = []
            for (let i = 0; i < 457; i++){
                compileThing.push(`550C: UPDATE [DEVICE ${getRandom(16)}] USEABLE => USEABLE`)
            }
            setInterval(() => {
                compileText.value.push(compileThing[compileText.value.length - json.length])
                scrollWrap?.scrollTo(0, scrollWrap.scrollHeight)
            }, 10)
        }
    }
    
}
watch(() => compileText.value.length, () => {
    const length = props.page === '自编译' ? 140 : 520
    const type = props.page === '自编译' ? 'compile' : 'adaptation'
    const json = props.page === '自编译' ? compileJson : adaptationJson
    let _progress = parseInt(((compileText.value.length / length)*100).toFixed())
    progress.value = _progress < 100 ? _progress : 100
    if (progress.value === 100){
        isComplete.value = true
    }
    if (compileText.value.length === json.length){
        generateCompileInfo(false, type)
    }
})

watch(() => isComplete.value, () => {
    if (isComplete.value === true){
        pubsub.publish('init-loading-finish',1)
    }
})

onMounted(() => {
    if (props.page === '自编译'){
        generateCompileInfo(true, 'compile')
    }else if (props.page === '自组织'){
        const in1 = setInterval(() => {
            let _progress = progress.value += 1
            progress.value = _progress > 100 ? 100 : _progress
            if (progress.value >= 100){
                isComplete.value = true
                clearInterval(in1)
            }
        }, 28)
        
    }else if (props.page === '自适应'){
        generateCompileInfo(true, 'adaptation')
    }

    pubsub.subscribe('init-loading-over',() => {
        isLoadingOver.value = true
        setTimeout(() => {
            pubsub.publish('request-init-ai', 1)
        }, 800);
    })
})

</script>

<style lang='less' scoped>
.window-interface{
    position: absolute;
    width: 480px;
    height: 350px;
    background-color: rgb(48, 59, 59);
    animation: showWindow 0.3s;
    .title{
        position: relative;
        height: 30px;
        border-bottom: 3px solid orange;
        font-size: 18px;
        display: flex;
        justify-content: left;
        align-items: center;
        cursor: move;
        .title-item{
            padding: 5px;
            margin: 0 5px;
            color: white;
            cursor: pointer;
            transition-duration: 0.2s;
            &:hover{
                background-color: gray;
            }
            &[target-page = 'true']{
                background-color: orange;
                color: black;
            }
        }
    }
    .progress{
        position: relative;
        height: 50px;
        left: 0;
        width: 100%;
        border-bottom: 1px solid rgb(157, 174, 175);
        .inner-process{
            position: relative;
            left: 8px;
            top: 8px;
            width: calc(100% - 16px);
            height: calc(100% - 16px);
            background-color: rgb(121,141,142);
        }
        .progress-num{
            position: relative;
            color: white;
            font-size: 24px;
            top: -22px;
            text-align: center;
        }
    }
    .main-frame{
        position: relative;
        height: 270px;
        .text-item{
            position: relative;
            font-size: 16px;
            color: white;
            margin: 4px 0;
            user-select: none;
        }
        img#qu-bk{
            width: 100%;
        }
    }
}
.result-interface{
    position: relative;
    width: 200px;
    height: 50px;
    text-align: center;
    left: calc(50% - 100px);
    top: calc(-50% - 30px);
    background-color: rgb(34,47,45);
    border-left: 4px solid orange;
    border-right: 4px solid orange;
    font-size: 34px;
    text-align: center;
    line-height: 50px;
    overflow: hidden;
    white-space: nowrap;
    border-radius: 4px;
    color: aliceblue;
    animation: showResultSmall 0.4s;
}

</style>