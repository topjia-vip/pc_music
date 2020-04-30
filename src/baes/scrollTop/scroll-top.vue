<template>
    <div class="top_box" @click="toTop">
        <div class="top" title="返回顶部">
            <img src="../../resources/images/top.png" alt="">
        </div>
    </div>
</template>

<script>

export default {
  name: 'scroll-top',
  methods: {
    toTop () {
      this.$emit('toTop')
    }
  }
}
</script>

<style lang="less">

    .top_box {
        bottom: 140px;
        right: 30px;
        z-index: 10;
        position: fixed;
        cursor: pointer;
    }

    .top {
        background: #f8f8f8;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        padding-top: 8px;
        border: 1px solid #999999;
        color: #fff;
        border-radius: 2px;
    }

    .top:hover {
        background-color: #66666621;
    }
</style>
