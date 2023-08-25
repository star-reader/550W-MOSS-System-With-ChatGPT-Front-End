<template>
    <div class="top-nav">
        <div class="top-nav-item">文件</div>
        <div class="top-nav-item">编辑</div>
        <div class="top-nav-item">查看</div>
        <div class="top-nav-item">运行</div>
        <div class="top-nav-item">调试</div>
        <div class="top-nav-item">关于</div>
    </div>
</template>

<script lang='ts' setup>

</script>

<style lang='less' scoped>
.top-nav{
    position: relative;
    left: 0;
    width: 100%;
    top: 0;
    height: 55px;
    background-color: orange;
    display: flex;
    flex-wrap: nowrap;
    justify-content: left;
    align-items: center;
    user-select: none;
    .top-nav-item{
        position: relative;
        font-size: 22px;
        height: 28px;
        margin: 0 10px;
        padding: 4px 3px;
        border-radius: 4px;
        background-color: #000;
        color: aliceblue;
        cursor: pointer;
        &:hover{
            background-color: rgb(96,96,96);
        }
    }
}
</style>