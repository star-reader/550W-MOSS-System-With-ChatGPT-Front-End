<template>
    <!-- 启动效果 -->
    <StartScreen v-if="startShowSwitch === 0" />
    <Booting v-if="startShowSwitch === 1 && isShowStart" />
    <!-- 背景面板 -->
    <BasicBackground v-if="!isShowStart" />
</template>

<script lang='ts' setup>
import axios from 'axios'
import StartScreen from './screens/StartScreen.vue'
import Booting from './screens/Booting.vue'
import BasicBackground from './screens/BasicBackground.vue';
import { onMounted, ref } from 'vue'
import { setAuth } from './hooks/auth/useAuth';

const startShowSwitch = ref(0)
const isShowStart = ref(true)

onMounted(() => {
    axios.get(`http://localhost:17700/ai/getConfig`).then(res => {
        if (!localStorage.getItem('did')){
          localStorage.setItem('did', res.data.dialog)
        }
    })
    
    setAuth(false)
    setTimeout(() => {
      startShowSwitch.value = 1
    }, 2100);
    setTimeout(() => {
      isShowStart.value = false
    }, 4800);
})

</script>

<style lang='less'>
@font-face {
  font-family: "550w-main";
  src: url("@/assets/chinese.ttf") format("truetype");
}

#app{
    padding: 0;
    margin: 0;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    font-family: '550w-main','Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0.5em;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background-color: #888;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background-color: #f1f1f1;
}

</style>