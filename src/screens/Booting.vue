<template>
    <div class="boot-screen global-screen">
        <div v-for="i in toShowInfo" class="boot-info-item">{{ i }}</div>
    </div>
</template>

<script lang='ts' setup>
import { onMounted, ref, type Ref } from 'vue';

const info = [
    "550W BASIC OPERATING SYSTEM",
    "UEG AUTHORIZATION REQUIRMENT MODULE FOUND",
    "SYSTEM SELF-TEST POWER ALLOCATION: LOW#NAME: DETECTION MODULE",
    "SERVICE CLOSEWARNING: 0#NAME: SOLAR POWER STATION",
    "SERVICE CLOSEWARNING: 0#NAME: LIFE SUPPORT DEVICE",
    "SERVICE CLOSEWARNING: 0#NAME: SATELLITE",
    "SERVICE CLOSEWARNING: 0#NAME: DETECTION MODULE",
    "BUILDING SYSTEM INTERFACE",
    "READY"
]
const toShowInfo: Ref<string[]> = ref([])

onMounted(() => {
    setInterval(() => {
        toShowInfo.value.push(
            info[toShowInfo.value.length]
        )
    }, 180)
})

</script>

<style lang='less' scoped>
.boot-screen{
    padding: 18px;
    margin: 0;
    background-color: #000;   
    .boot-info-item{
        font-size: 22px;
        color: #FAFCFF;
        margin: 5px 0;
    }
}
</style>