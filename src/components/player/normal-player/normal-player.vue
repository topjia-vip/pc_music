<template>
    <div class="normal-player">
        <button @click="closeNormalPlayer">点击关闭</button>
        player
    </div>
</template>

<script>
export default {
  name: 'normal-player',
  methods: {
    closeNormalPlayer () {
      this.$emit('closeNormalPlayer')
    }
  }
}
</script>

<style lang="less">
    .normal-player {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: -100;
        background-color: rgb(41, 42, 43);
    }
</style>
