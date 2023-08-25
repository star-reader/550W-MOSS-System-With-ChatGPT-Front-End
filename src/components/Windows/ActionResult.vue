<template>
    <div class="action-result" :action-status="props.status">
        {{ props.text }}
    </div>
</template>

<script lang='ts' setup>
const props = defineProps<{
    text: string,
    status: boolean
}>()
</script>

<style lang='less' scoped>
.action-result{
    position: absolute;
    width: 500px;
    left: calc(50% - 250px);
    height: 120px;
    top: calc(50% - 60px);
    background-color: rgb(34,47,45);
    border-left: 4px solid orange;
    border-right: 4px solid orange;
    z-index: 10000;
    font-size: 50px;
    text-align: center;
    line-height: 120px;
    overflow: hidden;
    white-space: nowrap;
    color: rgb(66, 232, 154);
    &[action-status = 'false']{
        color: orangered;
    }
    animation: showResult 0.6s;
}
</style>