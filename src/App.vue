<template>
    <div class="outer" ref="outer">
        <div class="layout" ref="viewBox" @scroll="orderScroll">
            <Layout v-show="!fullScreen">
                <m-header @searchBlur="searchBlur"/>
                <keep-alive>
                    <router-view @searchBlur="searchBlur" @toTop="toTop"/>
                </keep-alive>
            </Layout>
            <player ref="player"/>
            <scroll-top v-show="showTopBox" @toTop="toTop"/>
        </div>
    </div>
</template>

<script>
import { Layout } from 'view-design'
import MHeader from './components/m-header/m-header'
import Player from './components/player/player'
import { mapGetters } from 'vuex'
import ScrollTop from './baes/scrollTop/scroll-top'

export default {
  components: {
    ScrollTop,
    Player,
    MHeader,
    Layout
  },
  data () {
    return {
      showTopBox: false
    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.$refs.outer.style.height = `${window.innerHeight}px`
    })
    this.$refs.outer.style.height = `${window.innerHeight}px`
  },
  computed: {
    ...mapGetters([
      'fullScreen'
    ])
  },
  methods: {
    toTop () {
      this.$refs.viewBox.scrollTop = 0
    },
    orderScroll (e) {
      if (e.target.scrollTop >= 200) {
        if (!this.showTopBox) {
          this.showTopBox = !this.showTopBox
        }
      } else {
        if (this.showTopBox) {
          this.showTopBox = !this.showTopBox
        }
      }
    },
    searchBlur () {
      this.$refs.player.addKeyEvent()
    }
  }
}
</script>

<style scoped lang="less">
    .outer {
        position: fixed;
        width: 100%;
        overflow: hidden;

        .layout {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        .layout {
            overflow: auto;
            height: 100%;
        }

        .layout::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        .layout::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        .layout::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: #bababa;
        }

        /*---鼠标点击滚动条显示样式--*/

        .layout::-webkit-scrollbar-thumb:hover {
            background-color: #999999;
        }

        .layout::-webkit-scrollbar-thumb:active {
            background-color: #666666;
        }
    }
</style>
