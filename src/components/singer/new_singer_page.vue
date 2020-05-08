<template>
    <Content class="singer" v-if="singerListData">
        <div class="singer-content" v-if="isShow">
            <NewTags :tags="singerListData.tags" :area="area" :index="index" :genre="genre" :sex="sex"
                     @selectTag="selectTag"/>
            <NewSingerList :singer-list="singerListData.singerList"
                           :hot-singer-list="hotSinger"
                           :index="index"
                           :show-hot="showHot"
                           :show-singer-list="showSingerList"
                           :total="singerListData.total"
                           :curPage="curPage"
                           @changePage="changePage"/>
        </div>
        <m-footer v-if="isShow"/>
        <loading v-if="!isShow"/>
    </Content>
</template>

<script>
import ViewUI, { Content } from 'view-design'
import { getSingerList } from '../../api/singer'
import { ERR_OK } from '../../api/config'
import MFooter from '../../baes/footer/m-footer'
import Loading from '../../baes/loading/loading'
import NewTags from './tags/new_tags'
import NewSingerList from './singer-list/new_singer_list'

const PAGE_SIZE = 80

export default {
  name: 'new_singer_page',
  components: {
    NewSingerList,
    NewTags,
    Loading,
    MFooter,
    Content
  },
  data () {
    return {
      singerListData: [],
      hotSinger: [],
      area: '-100',
      index: '-100',
      sex: '-100',
      genre: '-100',
      sin: 0,
      curPage: 1,
      isShow: false,
      showHot: false,
      showSingerList: false
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      ViewUI.LoadingBar.start()
      getSingerList(this.area, this.genre, this.index, this.sex, this.sin, this.curPage).then(res => {
          if (res.code === ERR_OK) {
            this.singerListData = res.data
            this.hotSinger = this.singerListData.singerList.slice(0, 10)
            this.singerListData.singerList = this.singerListData.singerList.slice(10)
            this.showHot = this.hotSinger.length > 0
            this.showSingerList = this.singerListData.singerList.length > 0
          }
          this.isShow = true
          ViewUI.LoadingBar.finish()
        }
      )
    },
    selectTag (id, type) {
      if (type === 'index') {
        if (this.index === id) {
          return
        }
        this.index = id
      } else if (type === 'area') {
        if (this.area === id) {
          return
        }
        this.area = id
      } else if (type === 'genre') {
        if (this.genre === id) {
          return
        }
        this.genre = id
      } else {
        if (this.sex === id) {
          return
        }
        this.sex = id
      }
      this.curPage = 1
      // 发送请求重新获取数据
      ViewUI.LoadingBar.start()
      getSingerList(this.area, this.genre, this.index, this.sex, this.sin, this.curPage).then(res => {
        if (res.code === ERR_OK) {
          this.singerListData = res.data
          this.hotSinger = this.singerListData.singerList.slice(0, 10)
          this.singerListData.singerList = this.singerListData.singerList.slice(10)
          this.showHot = this.hotSinger.length > 0
          this.showSingerList = this.singerListData.singerList.length > 0
        }
        ViewUI.LoadingBar.finish()
      })
    },
    changePage (curPage) {
      this.curPage = curPage
      // 发送请求重新获取数据
      ViewUI.LoadingBar.start()
      getSingerList(this.area, this.genre, this.index, this.sex, PAGE_SIZE * (this.curPage - 1), this.curPage)
        .then(res => {
          if (res.code === ERR_OK) {
            this.singerListData = res.data
            if (curPage === 1) {
              this.hotSinger = this.singerListData.singerList.slice(0, 10)
              this.singerListData.singerList = this.singerListData.singerList.slice(10)
            }
          }
          ViewUI.LoadingBar.finish()
        })
    }
  }
}
</script>

<style lang="less">
    .singer {
        position: relative;
        min-width: 900px;
        background-color: #ffffff;

        .singer-content {
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 60px;
            position: relative;
        }
    }
</style>
