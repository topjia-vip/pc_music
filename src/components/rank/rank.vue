<template>
    <Content class="rank">
        <div class="rank-content" v-show="isShow">
            <div class="top-list">
                <toplist-nav :topListInfo="topListInfo" @selectTop="selectTop"/>
                <keep-alive>
                    <router-view @toTop="toTop"/>
                </keep-alive>
            </div>
        </div>
        <m-footer v-show="isShow"/>
        <loading v-show="!isShow"/>
    </Content>
</template>

<script>
import ViewUI, { Content } from 'view-design'
import { topListInfo } from '../../api/rank'
import ToplistNav from './toplist_nav/toplist-nav'
import { mapMutations, mapGetters } from 'vuex'
import MFooter from '../../baes/footer/m-footer'
import Loading from '../../baes/loading/loading'

export default {
  name: 'rank',
  components: {
    Loading,
    MFooter,
    ToplistNav,
    Content
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$router.push(`/rank/${vm.currentTop.topId}`)
    })
  },
  beforeRouteUpdate (to, from, next) {
    if (to.name === 'rank') {
      next(false)
    } else {
      next()
    }
  },
  data () {
    return {
      topListInfo: [],
      topId: 4,
      isShow: false
    }
  },
  created () {
    this._initTopListInfo()
  },
  computed: {
    ...mapGetters([
      'currentTop'
    ])
  },
  methods: {
    toTop () {
      this.$emit('toTop')
    },
    _initTopListInfo () {
      ViewUI.LoadingBar.start()
      topListInfo().then(res => {
        this.topListInfo = res.toplist
        this.setCurrentTop(res.toplist[0].topList.filter(item => item.topId === 4)[0])
        this.isShow = true
        ViewUI.LoadingBar.finish()
      })
    },
    selectTop (topId, groupId) {
      this.topId = topId
      const currentTop = this.topListInfo[groupId].topList.filter(item => item.topId === topId)[0]
      this.setCurrentTop(currentTop)
      this.$router.push({
        path: `/rank/${topId}`
      })
    },
    ...mapMutations({
      setCurrentTop: 'SET_CURRENT_TOP'
    })
  }
}
</script>

<style scoped lang="less">
    .rank {
        position: relative;
        background-color: #ffffff;

        .rank-content {
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
        }
    }
</style>
