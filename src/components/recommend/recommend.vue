<template>
    <Content class="recommend">
        <recommend-disst-list v-show="isShow" :recommendDisstList="recommendDisstList"/>
        <recommend-new-songs v-show="isShow" :newSongs="newSongs" :handleSongs="handleSongs"/>
        <recommend-pic v-show="isShow" :recommendFocus="recommendFocus"/>
        <m-footer v-show="isShow"/>
        <loading v-show="!isShow"/>
    </Content>
</template>

<script>
import ViewUI, { Content } from 'view-design'
import recommendPic from './recommendPic/recommendPic'
import RecommendDisstList from './recommendDisstList/recommendDisstList'

import { getRecommend } from '../../api/recommend'
import { ERR_OK } from '../../api/config'
import RecommendNewSongs from './recommendNewSongs/recommend-new-songs'
import MFooter from '../../baes/footer/m-footer'
import Loading from '../../baes/loading/loading'
import { _normalizeSongs } from '../../common/js/util'

export default {
  name: 'recommend',
  components: {
    Loading,
    RecommendNewSongs,
    RecommendDisstList,
    Content,
    recommendPic,
    MFooter
  },
  data () {
    return {
      isShow: false,
      recommendFocus: [],
      recommendDisstList: [],
      handleSongs: [],
      newSongs: []
    }
  },
  created () {
    this._initRecommend()
  },
  methods: {
    _initRecommend () {
      ViewUI.LoadingBar.start()
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          // 获取推荐轮播图数据
          const focus = this.handleRes(res.data.focus, 2)
          // 获取推荐歌单数据
          const recommendDisstList = this.handleRes(res.data.dissts, 5)
          // 获取新歌列表
          const newSongs = _normalizeSongs(res.data.new_song)
          const handleSongs = this.handleRes(newSongs, 9)
          this.recommendFocus = focus
          this.recommendDisstList = recommendDisstList
          this.newSongs = newSongs
          this.handleSongs = handleSongs
        }
        this.isShow = true
        ViewUI.LoadingBar.finish()
      })
    },
    handleRes (data, num) {
      let res = []
      let len = Math.floor(data.length / num)
      let j = 0
      for (let i = 0; i < len; i++) {
        let temp = []
        for (let k = 0; k < num; k++) {
          temp[k] = data[j + k]
        }
        j += num
        res[i] = temp
      }
      return res
    }
  }
}
</script>

<style scoped lang="less">
    .recommend {
        position: relative;
        height: 100%;
        min-width: 900px;
    }
</style>
