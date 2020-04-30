<template>
    <Content class="dissts">
        <div class="dissts-content" v-show="isShow">
            <div class="dissts_item">
                <dissts-tag-nav :categoryGroups="categoryGroups" @selectCategoryGroup="selectCategoryGroup"/>
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
import { disstCategoryGroup } from '../../api/disst'
import { ERR_OK } from '../../api/config'
import MFooter from '../../baes/footer/m-footer'
import Loading from '../../baes/loading/loading'
import DisstsTagNav from './dissts-tag-nav/dissts-tag-nav'
import DisstList from './disst-list/disst-list'
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'dissts',
  components: {
    DisstList,
    DisstsTagNav,
    Loading,
    MFooter,
    Content
  },
  data () {
    return {
      isShow: false,
      categoryGroups: [],
      isDetail: false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$router.push(`/dissts/${vm.categoryGroupId}`)
    })
  },
  beforeRouteUpdate (to, from, next) {
    if (to.name === 'dissts') {
      next(false)
    } else {
      next()
    }
  },
  computed: {
    ...mapGetters([
      'categoryGroupId'
    ])
  },
  created () {
    this._disstCategoryGroup()
  },
  methods: {
    toTop () {
      this.$emit('toTop')
    },
    _disstCategoryGroup () {
      ViewUI.LoadingBar.start()
      disstCategoryGroup().then(res => {
        if (res.code === ERR_OK) {
          this.categoryGroups = res.categoryGroups
        }
        this.isShow = true
        ViewUI.LoadingBar.finish()
      })
    },
    selectCategoryGroup (id) {
      this.setCategoryGroupId(id)
      this.$router.push({
        path: `/dissts/${id}`
      })
    },
    ...mapMutations({
      setCategoryGroupId: 'SET_CATEGORY_GROUP_ID'
    })
  }
}
</script>

<style lang="less">
    .dissts {
        position: relative;
        background-color: #ffffff;

        .dissts-content {
            max-width: 1200px;
            min-width: 900px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
        }
    }
</style>
