<template>
    <Header class="m-header">
        <div class="m-header-wrapper" ref="wrapper">
            <img class="m-header-title" src="../../resources/images/YueMusic.png" alt="悦音乐">
            <tab/>
            <mini-search-box @searchBlur="searchBlur"/>
        </div>
    </Header>
</template>

<script>
import { Header } from 'view-design'
import Tab from '../tab/tab'
import MiniSearchBox from '../search/mini-search-box/mini-search-box'

export default {
  name: 'm-header',
  methods: {
    searchBlur () {
      this.$emit('searchBlur')
    }
  },
  components: {
    MiniSearchBox,
    Tab,
    Header
  }
}
</script>

<style scoped lang="less">
    .m-header {
        min-width: 900px;
        background-color: #ffffff;
        height: 90px;
        position: relative;

        .m-header-wrapper {
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            height: 100%;
            border-bottom: 1px solid #f4f4f4;

            .m-header-title {
                float: left;
                line-height: 90px;
                height: 100%;
            }
        }
    }
</style>
