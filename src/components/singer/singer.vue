<template>
    <Content class="singer" v-if="singerList">
        <div class="singer-title" v-show="isShow">
            <h1>
                <span>这里有你喜欢的歌手</span>
            </h1>
        </div>
        <div class="singer-content" v-show="isShow">
            <tags :tags="singerList.tags" :area="area" :index="index" :genre="genre" :sex="sex"
                  @selectTag="selectTag"/>
            <singer-list :singer-list="singerList.singerList"
                         :hot-singer-list="hotSinger"
                         :index="index"
                         :total="singerList.total"
                         @changePage="changePage"
            />
        </div>
        <m-footer v-show="isShow"/>
        <loading v-show="!isShow"/>
    </Content>
</template>

<script>
import ViewUI, { Content } from 'view-design'
import { getSingerList } from '../../api/singer'
import { ERR_OK } from '../../api/config'
import Tags from './tags/tags'
import SingerList from './singer-list/singer-list'
import Loading from '../../baes/loading/loading'
import MFooter from '../../baes/footer/m-footer'

const PAGE_SIZE = 80
export default {
  name: 'singer',
  components: {
    Loading,
    SingerList,
    Tags,
    Content,
    MFooter
  },
  data () {
    return {
      singerList: [],
      hotSinger: [],
      area: '-100',
      index: '-100',
      sex: '-100',
      genre: '-100',
      sin: 0,
      cur_page: 1,
      isShow: false
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      ViewUI.LoadingBar.start()
      getSingerList(this.area, this.genre, this.index, this.sex, this.sin, this.cur_page).then(res => {
          if (res.code === ERR_OK) {
            this.singerList = res.data
            if (this.index === '-100') {
              this.hotSinger = this.singerList.singerList.slice(0, 10)
              this.singerList.singerList = this.singerList.singerList.slice(10)
            }
          }
          this.isShow = true
          ViewUI.LoadingBar.finish()
        }
      )
    },
    selectTag (id, type) {
      if (type === 'index') {
        this.index = id
      } else if (type === 'area') {
        this.area = id
      } else if (type === 'genre') {
        this.genre = id
      } else {
        this.sex = id
      }
      // 发送请求重新获取数据
      ViewUI.LoadingBar.start()
      this.isShow = false
      getSingerList(this.area, this.genre, this.index, this.sex, this.sin, this.cur_page).then(res => {
        if (res.code === ERR_OK) {
          this.singerList = res.data
          if (this.index === '-100') {
            this.hotSinger = this.singerList.singerList.slice(0, 10)
            this.singerList.singerList = this.singerList.singerList.slice(10)
          }
        }
        ViewUI.LoadingBar.finish()
        this.isShow = true
      })
    },
    changePage (curPage) {
      // 发送请求重新获取数据
      ViewUI.LoadingBar.start()
      this.isShow = false
      getSingerList(this.area, this.genre, this.index, this.sex, PAGE_SIZE * (curPage - 1), curPage).then(res => {
        if (res.code === ERR_OK) {
          this.singerList = res.data
          if (this.index === '-100' && curPage === 1) {
            this.hotSinger = this.singerList.singerList.slice(0, 10)
            this.singerList.singerList = this.singerList.singerList.slice(10)
          }
        }
        ViewUI.LoadingBar.finish()
        this.isShow = true
      })
    }
  }
}
</script>

<style scoped lang="less">
    .singer {
        position: relative;
        min-width: 900px;

        .singer-title {
            user-select: none;
            border-radius: 20px;
            text-align: center;
            line-height: 300px;
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            margin-top: 40px;
            position: relative;
            height: 300px;
            color: #f8f8f8;
            background-color: #1fc8db;
            background-image: linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%);
        }

        .singer-content {
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 60px;
            position: relative;
        }
    }
</style>
