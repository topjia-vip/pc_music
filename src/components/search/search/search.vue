<template>
    <div class="search">
        <div class="search_box">
            <div class="search_main">
                <div class="search_input_box">
                    <input :value="key"
                           ref="searchInput"
                           type="text"
                           class="search_input"
                           @keypress.enter.prevent="saveKey"
                           @input="changeInput($event)"
                           @focus="foucus"
                           @blur="blur"
                           placeholder="搜索"
                    />
                    <div class="search_btn" @click="saveKey"/>
                    <div class="search_mini_result_box" v-if="!smartSearchResNull"
                         v-show="isShowSearchBox && key!=='' && !searching">
                        <div class="search_mini_res_box" v-if="smartSearch">
                            <div class="search_mini_res">
                                <div class="search_mini_song" v-show="smartSearch.songs.length>0">
                                    <h3 class="hd">
                                        <i class="icon song_icon"/>
                                        <span>单曲</span>
                                    </h3>
                                    <ul class="list">
                                        <li v-for="(song,index) in smartSearch.songs" :key="index"
                                            @click="selectSong(song)">
                                            <div class="search_result_link" v-html="handleName(song,'song')">
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="search_mini_singer" v-show="smartSearch.singers.length>0">
                                    <h3 class="hd">
                                        <i class="icon singer_icon"/>
                                        <span>歌手</span>
                                    </h3>
                                    <ul class="list">
                                        <li v-for="(singer,index) in smartSearch.singers" :key="index"
                                            @click="selectSinger(singer)">
                                            <div class="search_result_link" v-html="handleName(singer,'singer')">
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="search_res_box" v-if="searchRes">
                    <div class="search_info" v-html="handleInfo()">
                    </div>
                    <div class="search_type_box">
                        <ul class="search_type_ul">
                            <li class="item" :class="searchType==='song'?'active':''" @click="selectType('song')">
                                单曲
                            </li>
                            <li class="item" :class="searchType==='album'?'active':''" @click="selectType('album')">
                                专辑
                            </li>
                            <li class="item" :class="searchType==='playlist'?'active':''"
                                @click="selectType('playlist')">
                                歌单
                            </li>
                            <li class="item" :class="searchType==='lyric'?'active':''" @click="selectType('lyric')">
                                歌词
                            </li>
                        </ul>
                    </div>
                    <!--搜索结果展示-->
                    <div class="search_res_by_type" v-if="!nullRes">
                        <!--单曲搜索-->
                        <div class="search_res_song" v-if="searchType==='song'">
                            <div class="zhida_singer_box" v-if="searchRes.zhida">
                                <div class="singer_image_box">
                                    <img class="singer_image"
                                         :title="searchRes.zhida.singer.singerName"
                                         :src="searchRes.zhida.singer.singerPic"
                                         :alt="searchRes.zhida.singer.singerName"
                                         @click="selectSinger(searchRes.zhida.singer)"
                                    >
                                </div>
                                <div class="singer_name">
                                    <h3 class="name">
                                        <span @click="selectSinger(searchRes.zhida.singer)"
                                              :title="searchRes.zhida.singer.singerName"
                                        >
                                            {{searchRes.zhida.singer.singerName}}
                                        </span>
                                    </h3>
                                </div>
                                <div class="singer_info">
                                    <span>单曲：{{searchRes.zhida.songNum}}</span>
                                    <span>专辑：{{searchRes.zhida.albumNum}}</span>
                                    <span>MV：{{searchRes.zhida.mvNum}}</span>
                                </div>
                            </div>
                            <div class="song_list_box">
                                <ul class="song_list_hd">
                                    <li class="song_list_hd_name">歌曲</li>
                                    <li class="song_list_hd_author">歌手</li>
                                    <li class="song_list_hd_album">专辑</li>
                                    <li class="song_list_hd_time">时长</li>
                                </ul>
                                <ul class="song_list">
                                    <li v-for="(song,index) in searchRes.hiLights" :key="index"
                                        :style="(index+1) % 2 === 0?'background: rgba(153, 153, 153, 0.07)':''"
                                        @click="playSong(index)"
                                    >
                                        <div class="song_list_item">
                                            <div class="song_name_box">
                                                <div class="image_box" :title="song.song_name">
                                                    <img class="image"
                                                         :src="song.song_image"
                                                         :alt="song.song_name"
                                                         :onerror="errorImage"
                                                    >
                                                </div>
                                                <div class="song_name">
                                                    <span @click.stop="songDetail(index)" v-html="song.songname_hilight"
                                                          :title="song.song_name"/>
                                                </div>
                                            </div>
                                            <div class="song_singer_box">
                                                <span class="singer_name"
                                                      v-for="(singer,singerIndex)
                                                      in song.singer_hilight"
                                                      v-html="singer.singer_name_hiLight"
                                                      :key="singerIndex"
                                                      :title="singer.singer_name"
                                                      @click.stop="singerDetail(index,singerIndex)"
                                                />
                                            </div>
                                            <div class="song_album_box">
                                                <span class="album_name"
                                                      v-html="song.albumname_hilight"
                                                      :title="song.song_album"/>
                                            </div>
                                            <div class="time_box">{{_handleTime(searchRes.songList[index].duration)}}
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!--专辑搜索-->
                        <div class="search_res_album" v-if="searchType==='album'">
                            <div class="album_list_box">
                                <ul>
                                    <li v-for="(data,index) in searchRes.dataShowList" :key="index">
                                        <div class="album_image_box">
                                            <img class="image"
                                                 :src="data.albumPic"
                                                 :alt="data.albumName"
                                                 :title="data.albumName"
                                                 onerror="this.src='https://y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000'"
                                            >
                                            <i class="album_image_icon"/>
                                        </div>
                                        <p class="album_name">
                                            <a class="album_name_link"
                                               :title="data.albumName"
                                               v-html="data.albumName_hilight"
                                            />
                                        </p>
                                        <p class="album_singer_name_box">
                                            <span class="album_singer_name"
                                                  :title="data.singerName"
                                            >
                                                <a v-for="(singer,singerIndex) in data.singer_list"
                                                   :key="singerIndex"
                                                   v-html="singer.name_hilight"
                                                   @click="singerDetail(index,singerIndex)"
                                                />
                                            </span>
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!--歌单搜索-->
                        <div class="search_res_playlist" v-if="searchType==='playlist'">
                            <div class="playlist_box">
                                <ul>
                                    <li v-for="(disst,index) in searchRes.dissts"
                                        :style="(index+1) % 2 === 0?'background: rgba(153, 153, 153, 0.07)':''"
                                        :key="index">
                                        <div class="disst_item_box">
                                            <div class="disst_info">
                                                <a class="disst_link">
                                                    <img class="disst_image"
                                                         :src="disst.disstLogo"
                                                         :alt="disst.disstName"
                                                         onerror="this.src='https://y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000'"
                                                         @click="selectDisstDetail(disst)"
                                                    >
                                                </a>
                                                <div class="disst_name_box">
                                                    <a class="disst_name" v-html="disst.disstName"
                                                       @click="selectDisstDetail(disst)"/>
                                                    <i class="play_disst_btn" title="播放"
                                                       @click="playDisst(disst,index)"/>
                                                </div>
                                            </div>
                                            <div class="disst_author_box">
                                                <div class="disst_song_count">
                                                    <span>{{disst.songNum}}首</span>
                                                </div>
                                                <div class="disst_author">
                                                    <span>by</span>
                                                    <span class="disst_author_name" v-html="disst.nickname"/>
                                                </div>
                                            </div>
                                            <div class="disst_visitnum">
                                                <span>收听量：{{handleVisitNum(disst.visitnum)}}</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!--歌词搜索-->
                        <div class="search_res_lyric" v-if="searchType==='lyric'">
                            <div class="lyrics_box">
                                <ul>
                                    <li v-for="(lyric,index) in searchRes.showData "
                                        :key="index"
                                    >
                                        <div class="lyric_item_box">
                                            <div class="lyric_song_info">
                                                <div class="lyric_song_name">
                                                    <a class="lyric_song_name_txt"
                                                       v-html="lyric.songname_hilight"
                                                       :title="lyric.songname"
                                                       @click="songDetail(index)"
                                                    />
                                                </div>
                                                <div class="lyric_play_song_icon">
                                                    <i class="play_icon" title="播放" @click="playSong(index)"/>
                                                </div>
                                                <div class="lyric_singer_box">
                                                    <a class="lyric_singer_name"
                                                       v-for="(singer,SingerIndex) in lyric.singer"
                                                       v-html="singer.name_hilight" :title="singer.name"
                                                       :key="SingerIndex"
                                                       @click="singerDetail(index,SingerIndex)"
                                                    />
                                                </div>
                                                <div class="lyric_album_box">
                                                    <a class="lyric_album_name" :title="lyric.albumname">
                                                        <span>《</span>
                                                        <a v-html="lyric.albumname_hilight"/>
                                                        <span>》</span>
                                                    </a>
                                                </div>
                                                <div class="lyric_time_box">
                                                    <span class="lyric_time_txt">{{_handleTime(lyric.interval)}}</span>
                                                </div>
                                            </div>
                                            <div class="lyric_content_box">
                                                <div class="lyric_content"
                                                     :class="isOpen[index]?'lyric_content_max':''">
                                                    <p v-html="handleLyric(lyric.content)"/>
                                                </div>
                                                <div class="lyric_content_toolbar">
                                                    <div class="open_lyric_btn" @click="openLyric(index)">
                                                        <i class="icon more_icon"/>
                                                        {{isOpen[index]?'收起':'展开'}}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--分页器-->
                    <div class="pageHelper" v-if="!nullRes">
                        <Page :current="page" :total="handleTotal()" :page-size="30" @on-change="changePage"/>
                    </div>
                    <!--搜索无结果提示-->
                    <div class="search_res_null" v-if="nullRes">
                        <h3>很抱歉，暂时没有找到与"<span>{{this.searchKey}}</span>"相关的结果</h3>
                        <h3>建议缩短关键词，重新搜索</h3>
                    </div>
                </div>
                <!--第一次进入搜索页提示-->
                <div class="search_first" v-if="!searchRes && !nullRes && !this.searchKey">
                    <h2>音乐之旅</h2>
                    <h2>从这里开始</h2>
                </div>
                <!--搜索loading-->
                <svg class="loading_logo" v-show="isShow" xmlns="http://www.w3.org/2000/svg"
                     xmlns:xlink="http://www.w3.org/1999/xlink"
                     width="480px"
                     height="60px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50" xml:space="preserve">
    <rect x="0" y="7.6416" width="4" height="14.7168" fill="#FF6700" opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s"
                 repeatCount="indefinite"></animate>
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s"
                 repeatCount="indefinite"></animate>
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s"
                 repeatCount="indefinite"></animate>
    </rect>
                    <rect x="8" y="5.1416" width="4" height="19.7168" fill="#FF6700" opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s"
                 repeatCount="indefinite"></animate>
                        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s"
                                 repeatCount="indefinite"></animate>
                        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s"
                                 repeatCount="indefinite"></animate>
    </rect>
                    <rect x="16" y="7.3584" width="4" height="15.2832" fill="#FF6700" opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s"
                 repeatCount="indefinite"></animate>
                        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s"
                                 repeatCount="indefinite"></animate>
                        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s"
                                 repeatCount="indefinite"></animate>
    </rect>
</svg>
            </div>
        </div>
        <m-footer/>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import MFooter from '../../../baes/footer/m-footer'
import { smartSearch, search } from '../../../api/search'
import { ERR_OK } from '../../../api/config'
import { _normalizeSongs, handleTime } from '../../../common/js/util'
import { Page } from 'view-design'
import { disstDetailSongList } from '../../../api/disst'

let num = 30
export default {
  name: 'search',
  components: { MFooter, Page },
  data () {
    return {
      errorImage: 'this.src="' + require('../../../resources/images/img.png') + '"',
      key: '',
      smartSearch: null,
      searchRes: null,
      searchType: 'song',
      isShowSearchBox: false,
      isShow: false,
      nullRes: false,
      smartSearchResNull: true,
      searching: false,
      isOpen: [],
      currentOpenLyric: -1,
      page: 1
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     console.log(vm.searchKey)
  //     console.log(vm.key)
  //     vm.searchType = 'song'
  //     vm.page = 1
  //     vm.key = ''
  //     vm.smartSearch = null
  //     vm.searchRes = null
  //     vm.isShowSearchBox = false
  //     vm.isShow = false
  //     vm.nullRes = false
  //     vm.searching = false
  //     if (vm.searchKey) {
  //       vm._search(0)
  //       vm._smartSearch(0)
  //     }
  //   })
  // },
  mounted () {
    setTimeout(() => {
      document.addEventListener('mouseup', e => {
        const x = document.getElementsByClassName('search_input_box')[0]
        if (x) {
          if (!x.contains(event.target)) {
            this.isShowSearchBox = false
          }
        }
      })
      if (this.searchKey) {
        this._search(0)
        this._smartSearch(0)
      }
    }, 20)
  },
  computed: {
    ...mapGetters([
      'searchKey'
    ])
  },
  methods: {
    openLyric (index) {
      // 数组内容改变使用的方法，直接复制无法实时响应
      this.$set(this.isOpen, index, !this.isOpen[index])
    },
    handleLyric (lyric) {
      let res = `${lyric.replace(/\\n/g, '<br />')}`
      return res
    },
    playDisst (disst, index) {
      if (!disst.songlist) {
        disstDetailSongList(disst.disstId).then(res => {
          if (res.code === ERR_OK) {
            this.searchRes.dissts[index].songlist = _normalizeSongs(res.songs)
          }
          this.playDisstSong(this.searchRes.dissts[index].songlist)
        })
      } else {
        this.playDisstSong(this.searchRes.dissts[index].songlist)
      }
    },
    playDisstSong (list) {
      this.selectPlay(
        {
          list: list,
          index: 0
        }
      )
    },
    selectDisstDetail (disst) {
      this.$router.push({
        path: `/disst_detail/${disst.disstId}`
      })
    },
    handleVisitNum (number) {
      if (number >= 10000) {
        const num = number / 10000
        return `${Math.round(num * 10) / 10}万`
      } else {
        return number
      }
    },
    handleTotal () {
      if (this.searchRes.totalnum > 600) {
        this.searchRes.totalnum = 600
      }
      return this.searchRes.totalnum
    },
    changePage (page) {
      this.$emit('toTop')
      this.page = page
    },
    // 前往歌单详情
    songDetail (index) {
      let song = {}
      if (this.searchType === 'song') {
        song = this.searchRes.songList[index]
      } else if (this.searchType === 'lyric') {
        song = this.searchRes.songs[index]
      }
      this.setCurrentSong(song)
      this.$router.push({
        path: `/songinfo/${song.id}`
      })
    },
    // 前往歌手详情
    singerDetail (index, singerIndex) {
      let song = {}
      if (this.searchType === 'song') {
        song = this.searchRes.songList[index]
      } else if (this.searchType === 'album') {
        song = this.searchRes.albums[index]
      } else {
        song = this.searchRes.songs[index]
      }
      let singer = song.singers[singerIndex]
      this.setCurrentSinger(singer)
      this.$router.push({
        path: `/singer_detail/${singer.singerMid}`
      })
    },
    // 播放单曲
    playSong (index) {
      let song = {}
      if (this.searchType === 'song') {
        song = this.searchRes.songList[index]
      } else {
        song = this.searchRes.songs[index]
      }
      this.insertSong(song)
    },
    _handleTime (duration) {
      return handleTime(duration)
    },
    handleInfo () {
      if (this.searchType === 'song') {
        return `搜索"<em class="search_info_key">${this.searchKey}</em>"，找到了<em class="search_info_num">${this.searchRes.totalnum}</em>首歌曲`
      } else if (this.searchType === 'album') {
        if (this.searchRes.totalnum > 600) {
          this.searchRes.totalnum = 600
        }
        return `搜索"<em class="search_info_key">${this.searchKey}</em>"，找到了<em class="search_info_num">${this.searchRes.totalnum}</em>张专辑`
      } else if (this.searchType === 'playlist') {
        if (this.searchRes.totalnum > 600) {
          this.searchRes.totalnum = 600
        }
        return `搜索"<em class="search_info_key">${this.searchKey}</em>"，找到了<em class="search_info_num">${this.searchRes.totalnum}</em>个歌单`
      } else {
        return `搜索"<em class="search_info_key">${this.searchKey}</em>"，找到了<em class="search_info_num">${this.searchRes.totalnum}</em>个歌词`
      }
    },
    selectType (type) {
      if (type !== this.searchType) {
        this.searchType = type
      }
    },
    saveKey () {
      this.$refs.searchInput.blur()
      this.searching = true
      if (this.key) {
        this.setSearchKey(this.key)
      }
    },
    // 点击迷你搜索框的歌曲 跳转到该歌曲详情页
    selectSong (song) {
      this.key = song.name
      this.isShowSearchBox = false
      this.setCurrentSong(song)
      this.setSearchKey(this.key)
      this.$router.push({
        path: `/songinfo/${song.id}`
      })
    },
    // 点击歌手跳转歌手详情页
    selectSinger (singer) {
      this.key = singer.singerName
      this.isShowSearchBox = false
      this.setCurrentSinger(singer)
      this.setSearchKey(this.key)
      this.$router.push({
        path: `/singer_detail/${singer.singerMid}`
      })
    },
    // 迷你搜索
    _smartSearch (type = 1) {
      if (this.key === '') {
        this.smartSearch = null
        return
      }
      smartSearch(this.key).then(res => {
        this.smartSearch = res.data
        if (this.smartSearch && this.smartSearch.singers.length === 0 && this.smartSearch.songs.length === 0) {
          this.isShowSearchBox = false
          this.smartSearchResNull = true
        } else {
          this.smartSearchResNull = false
          if (type === 1) {
            this.isShowSearchBox = true
          }
        }
      })
    },
    // 输入框改变
    changeInput (e) {
      this.isShowSearchBox = false
      this.key = e.target.value
      if (this.key === '') {
        this.smartSearch = null
      } else {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this._smartSearch()
        }, 200)
      }
    },
    // 输入框聚焦，重置键盘输入
    foucus () {
      document.onkeydown = (e) => {}
      this.isShowSearchBox = true
      this.searching = false
    },
    // 输入框失焦，重置播放器键盘事件监听
    blur () {
      this.$emit('searchBlur')
    },
    // 处理mini搜索的关键字高亮
    handleName (item, type) {
      if (type === 'song') {
        const index = item.name.indexOf(this.key)
        if (index !== -1) {
          // 包含关键字 关键字高亮
          const subName1 = item.name.substring(0, index)
          const subName2 = item.name.substring(index + this.key.length)
          return `<span class="search_result_name">
                    <span>${subName1}</span>
                    <span class="search_result_name_keyword">${this.key}</span>
                    <span>${subName2}</span>
                  </span>
                  -
                  <span class="search_result_singer_name" style="font-size: 12px">
                     ${item.singers[0].singerName}
                  </span>`
        } else {
          // 不包含关键字
          return `<span class="search_result_name" style="font-size: 12px">
                     ${item.name}
                  </span>
                  -
                  <span class="search_result_singer_name" style="font-size: 12px">
                     ${item.singers[0].singerName}
                  </span>`
        }
      } else {
        const index = item.singerName.indexOf(this.key)
        if (index !== -1) {
          // 包含关键字 关键字高亮
          const subName1 = item.singerName.substring(0, index)
          const subName2 = item.singerName.substring(index + this.key.length)
          return `<span class="search_result_singer_name">
                    <span>${subName1}</span>
                    <span class="search_result_name_keyword">${this.key}</span>
                    <span>${subName2}</span>
                  </span>`
        } else {
          // 不包含关键字
          return `<span class="search_result_singer_name" style="font-size: 12px">${item.singerName}</span>`
        }
      }
    },
    // 搜索功能
    async _search (type = 1) {
      if (type === 1) {
        if (!this.key) {
          return
        }
      } else {
        this.key = this.searchKey
      }
      // 搜索
      this.isShow = true
      this.nullRes = false
      let res = await search(this.searchKey, num, this.page, this.searchType)
      if (res.code === ERR_OK) {
        if (res.data.message !== 'no_results') {
          if (this.searchType === 'song') {
            res.data.songList = _normalizeSongs(res.data.songList)
          } else if (this.searchType === 'lyric') {
            for (let i = 0; i < res.data.curnum; i++) {
              this.isOpen[i] = false
            }
            res.data.songs = _normalizeSongs(res.data.songs)
          }
          this.isShow = false
          this.searchRes = res.data
        } else {
          // 搜索结果为空
          this.searchRes = res.data
          this.nullRes = true
          this.isShow = false
        }
      }
    },
    ...mapMutations({
      setCurrentSinger: 'SET_CURRENT_SINGER',
      setCurrentSong: 'SET_CURRENT_SONG',
      setSearchKey: 'SET_SEARCH_KEY'
    }),
    ...mapActions([
      'selectPlay',
      'insertSong'
    ])
  },
  watch: {
    searchKey (newKey) {
      if (newKey === this.key) {
        this._search()
      } else {
        this._search(0)
      }
      this.page = 1
      this.searchRes = null
      this._smartSearch(0)
    },
    searchType () {
      this.page = 1
      this.searchRes = null
      this._search()
    },
    page () {
      this.searchRes = null
      this._search()
    }
  }
}
</script>

<style lang="less">
    .search {
        background: #ebebebdb;

        div {
            display: block;
        }

        .search_box {
            width: 1200px;
            min-width: 900px;
            min-height: 700px;
            margin: 0 auto;
            background-color: #fff;
            border: 1px solid #d3d3d3;
            border-width: 0 1px;

            .search_main {
                padding: 40px;

                .search_input_box {
                    background: url(../../../resources/images/sprite.png) no-repeat 0 9999px;
                }

                .search_input_box {
                    width: 420px;
                    height: 40px;
                    margin: 0 auto;
                    background-position: 0 0;
                    z-index: 10;

                    .search_input {
                        float: left;
                        width: 320px;
                        height: 17px;
                        margin: 12px 0 0 20px;
                        padding: 0;
                        background: #fff;
                        border: none;
                        opacity: 1;
                    }

                    .search_btn {
                        background: url(../../../resources/images/sprite.png) no-repeat 0 9999px;
                    }

                    .search_btn {
                        float: right;
                        width: 50px;
                        height: 40px;
                        text-indent: -9999px;
                    }

                    .search_btn:hover {
                        cursor: pointer;
                        background-position: -430px 0;
                        text-decoration: none;
                    }

                    .search_input:focus {
                        outline: none;
                    }

                    .search_mini_result_box {
                        position: absolute;
                        z-index: 120;
                        box-sizing: border-box;
                        border: 1px solid #bebebe;
                        border-radius: 4px;
                        background: #fff;
                        box-shadow: 0 4px 7px #555;
                        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);
                        top: 174px;
                        width: 418px;

                        .search_mini_res_box {
                            .search_mini_res {
                                .icon {
                                    background: url(../../../resources/images/icon.png) no-repeat 0 9999px;
                                }

                                .list {
                                    list-style: none;
                                    margin-left: 62px;
                                    margin-top: -1px;
                                    padding: 6px 0 5px;
                                    border-top: 1px solid #e2e2e2;
                                    border-left: 1px solid #e2e2e2;
                                }

                                .search_mini_song {
                                    .hd {
                                        float: left;
                                        width: 63px;
                                        margin-right: -100px;
                                        padding: 10px 0 0 10px;
                                        border-right: 1px solid #e2e2e2;
                                        line-height: 17px;
                                        font-weight: normal;

                                        span {
                                            color: #000000;
                                            font-size: 12px;
                                            float: left;
                                            font-style: normal;
                                            text-align: left;
                                        }

                                        .song_icon {
                                            width: 14px;
                                            height: 15px;
                                            background-position: -35px -300px;
                                            float: left;
                                            margin: 2px 4px 0 0;
                                        }
                                    }

                                    .list {
                                        .search_result_link {
                                            display: block;
                                            width: 100%;
                                            text-indent: 12px;
                                            line-height: 24px;
                                            color: #000000;

                                            .search_result_name {
                                                color: #333;
                                                font-size: 0;

                                                span {
                                                    font-size: 12px;
                                                }

                                                .search_result_name_keyword {
                                                    color: #ff938b;
                                                }
                                            }
                                        }

                                        .search_result_link:hover {
                                            cursor: pointer;
                                            background: #e8e7e69c;
                                        }
                                    }
                                }

                                .search_mini_singer {
                                    .hd {
                                        float: left;
                                        width: 63px;
                                        margin-right: -100px;
                                        padding: 10px 0 0 10px;
                                        border-right: 1px solid #e2e2e2;
                                        line-height: 17px;
                                        font-weight: normal;

                                        span {
                                            color: #000000;
                                            font-size: 12px;
                                            float: left;
                                            font-style: normal;
                                            text-align: left;
                                        }

                                        .singer_icon {
                                            width: 14px;
                                            height: 15px;
                                            background-position: -50px -300px;
                                            float: left;
                                            margin: 2px 4px 0 0;
                                        }
                                    }

                                    .list {
                                        .search_result_link {
                                            display: block;
                                            width: 100%;
                                            text-indent: 12px;
                                            line-height: 24px;
                                            color: #000000;

                                            .search_result_singer_name {
                                                color: #333;
                                                font-size: 0;

                                                span {
                                                    font-size: 12px;
                                                }

                                                .search_result_name_keyword {
                                                    color: #ff938b;
                                                }
                                            }
                                        }

                                        .search_result_link:hover {
                                            cursor: pointer;
                                            background: #e8e7e69c;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                .search_res_box {
                    .search_info {
                        margin: 28px 0 17px;
                        color: #999;
                        font-size: 12px;

                        .search_info_key {
                            font-style: normal;
                            text-align: left;
                            font-size: inherit;
                            color: #007eff;
                        }

                        .search_info_num {
                            font-style: normal;
                            text-align: left;
                            font-size: inherit;
                            color: #c20c0c;
                        }
                    }

                    .search_type_box {
                        height: 60px;
                        line-height: 60px;
                        text-align: center;

                        .search_type_ul {
                            height: 60px;
                            list-style: none;
                            border-bottom: 1px solid #ccc;
                            background: #cccccc21;

                            .active {
                                border-top: 2px solid #007eff;
                                border-left: 1px solid #ccc;
                                border-right: 1px solid #ccc;
                                border-bottom: none;
                                background: #FFFFFF;
                            }

                            li {
                                user-select: none;
                                color: #000000;
                                border-top: 2px solid #ccc;
                                cursor: pointer;
                                float: left;
                                width: 25%;
                                height: 60px;
                                font-size: 14px;
                                position: relative;
                                left: -1px;
                            }

                            li:hover {
                                border-top: 2px solid #007eff;
                            }
                        }
                    }

                    .search_res_by_type {
                        .search_res_song {
                            .zhida_singer_box {
                                overflow: hidden;
                                margin: 40px 0 40px;
                                padding-left: 20px;

                                .singer_image_box {
                                    float: left;
                                    margin-right: 20px;

                                    .singer_image {
                                        cursor: pointer;
                                        vertical-align: middle;
                                        width: 94px;
                                        height: 94px;
                                        border-width: 1px;
                                        border-style: solid;
                                        border-color: rgba(0, 0, 0, .15);
                                        border-radius: 50%;
                                    }
                                }

                                .singer_name {
                                    color: #000000;
                                    margin-top: 10px;

                                    .name {
                                        span {
                                            cursor: pointer;
                                        }

                                        span:hover {
                                            color: #ff938b;
                                        }
                                    }
                                }

                                .singer_info {
                                    margin-top: 20px;
                                    cursor: default;

                                    span {
                                        margin-right: 20px;
                                        color: #000000;
                                    }
                                }
                            }

                            .song_list_box {
                                margin-top: 40px;

                                .song_list {
                                    list-style: none;

                                    .song_list_item:hover {
                                        cursor: pointer;
                                        background: #e7e7e7;
                                    }
                                }

                                .song_list_hd, .song_list_item {
                                    list-style: none;
                                    position: relative;
                                    padding-right: 122px;
                                    padding-left: 20px;
                                }

                                .song_list_hd {
                                    height: 50px;
                                    line-height: 50px;
                                    background-color: rgba(209, 209, 209, 0.26);
                                    color: #999;
                                }

                                .song_list_hd_name, .song_name_box {
                                    float: left;
                                    width: 47.685185%;
                                    position: relative;
                                    white-space: normal;
                                }

                                .song_list_hd_author, .song_singer_box {
                                    float: left;
                                    padding-left: 15px;
                                    width: 25.5%;
                                    box-sizing: border-box;
                                }

                                .song_list_hd_album, .song_album_box {
                                    float: left;
                                    padding-left: 15px;
                                    width: 25.5%;
                                    box-sizing: border-box;
                                }

                                .song_list_hd_time, .time_box {
                                    position: absolute;
                                    right: 60px;
                                    width: 50px;
                                }

                                .song_list_item {
                                    height: 80px;
                                    line-height: 80px;
                                    background-color: rgba(0, 0, 0, .01);
                                    color: #999;

                                    em {
                                        font-style: normal;
                                        color: #ff938b;
                                    }

                                    .song_name_box {
                                        height: 80px;

                                        .image_box {
                                            float: left;
                                            width: 80px;
                                            height: 80px;
                                            display: block;

                                            .image {
                                                cursor: pointer;
                                                width: 60px;
                                                height: 60px;
                                                margin-top: 10px;
                                                margin-right: 10px;
                                            }
                                        }

                                        .song_name {
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                            white-space: nowrap;

                                            span {
                                                cursor: pointer;
                                            }

                                            span:hover {
                                                cursor: pointer;
                                                color: #ff938b;
                                                text-decoration: underline;
                                            }
                                        }
                                    }

                                    .song_singer_box {
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        height: 80px;

                                        .singer_name {
                                            cursor: pointer;
                                            margin-right: 8px;
                                        }

                                        .singer_name:hover {
                                            cursor: pointer;
                                            color: #ff938b;
                                            text-decoration: underline;
                                        }
                                    }

                                    .song_album_box {
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;

                                        .album_name {
                                            cursor: pointer;
                                        }

                                        .album_name:hover {
                                            cursor: pointer;
                                            color: #ff938b;
                                            text-decoration: underline;
                                        }
                                    }

                                    .time_box {
                                        cursor: default;
                                        color: #999999;
                                    }
                                }
                            }
                        }

                        .search_res_album {
                            .album_list_box {
                                margin-top: 40px;

                                ul {
                                    list-style: none;
                                    min-height: 1250px;

                                    li {
                                        float: left;
                                        width: 20%;
                                        overflow: hidden;
                                        padding: 0 0 30px 50px;

                                        .album_image_box {
                                            position: relative;
                                            width: 130px;
                                            height: 130px;
                                            display: block;
                                            float: left;

                                            .album_image_icon {
                                                background: url(../../../resources/images/coverall.png) 0 0 no-repeat;
                                            }

                                            .album_image_icon {
                                                position: absolute;
                                                top: 0;
                                                left: 0;
                                                width: 153px;
                                                height: 130px;
                                                background-position: 0 -845px;
                                                pointer-events: none;
                                            }

                                            .image {
                                                cursor: pointer;
                                                width: 100%;
                                                height: 100%;
                                            }
                                        }

                                        .album_name {
                                            margin: 8px 0 3px;
                                            font-size: 14px;
                                            width: 153px;
                                            float: left;
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                            white-space: nowrap;

                                            .album_name_link {
                                                color: #000;

                                                em {
                                                    font-style: normal;
                                                    color: #ff938b;
                                                }
                                            }

                                            .album_name_link:hover {
                                                text-decoration: underline;
                                            }
                                        }

                                        .album_singer_name_box {
                                            float: left;
                                            display: inline-block;
                                            max-width: 153px;
                                            vertical-align: middle;
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                            white-space: nowrap;
                                            word-wrap: normal;

                                            .album_singer_name {
                                                a {
                                                    cursor: pointer;
                                                    color: #666666;
                                                    font-size: 12px;
                                                    margin-right: 3px;

                                                    em {
                                                        font-style: normal;
                                                        color: #ff938b;
                                                    }
                                                }

                                                a:hover {
                                                    text-decoration: underline;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        .search_res_playlist {
                            .playlist_box {
                                margin-top: 40px;

                                ul {
                                    list-style: none;

                                    li {

                                        .disst_item_box {
                                            height: 80px;
                                            padding: 0 30px;

                                            .disst_info {
                                                width: 50%;
                                                float: left;

                                                .disst_link {
                                                    width: 80px;
                                                    height: 80px;
                                                    float: left;
                                                    display: block;

                                                    .disst_image {
                                                        width: 60px;
                                                        height: 60px;
                                                        margin-top: 10px;
                                                        margin-right: 10px;
                                                        float: left;
                                                    }
                                                }

                                                .disst_name_box {
                                                    height: 80px;
                                                    padding: 30px 0;
                                                    overflow: hidden;
                                                    text-overflow: ellipsis;
                                                    white-space: nowrap;

                                                    .disst_name {
                                                        color: #000000;
                                                    }

                                                    .disst_name:hover {
                                                        transition: 0s;
                                                        color: #ff938b;
                                                        text-decoration: underline;
                                                    }

                                                    .play_disst_btn {
                                                        background: url(../../../resources/images/table.png) no-repeat 0 9999px;
                                                    }

                                                    .play_disst_btn {
                                                        z-index: -1;
                                                        position: relative;
                                                        top: 2px;
                                                        float: right;
                                                        display: inline-block;
                                                        width: 17px;
                                                        height: 17px;
                                                        margin-right: 15px;
                                                        cursor: pointer;
                                                        background-position: 0 -103px;
                                                    }

                                                    .play_disst_btn:hover {
                                                        background-position: 0 -128px;
                                                    }
                                                }
                                            }

                                            .disst_author_box {
                                                overflow: hidden;
                                                white-space: nowrap;
                                                text-overflow: ellipsis;
                                                float: left;
                                                width: 35%;

                                                .disst_song_count {
                                                    float: left;
                                                    height: 80px;
                                                    padding: 30px 0;

                                                    span {
                                                        color: #999999;
                                                        font-size: 12px;
                                                    }
                                                }

                                                .disst_author {
                                                    height: 80px;
                                                    padding: 30px 100px;
                                                    color: #000000;

                                                    .disst_author_name {
                                                        cursor: default;
                                                        margin-left: 5px;
                                                    }
                                                }
                                            }

                                            .disst_visitnum {
                                                cursor: default;
                                                float: left;
                                                width: 15%;
                                                height: 80px;
                                                padding: 30px 0;

                                                span {
                                                    color: #999999;
                                                }
                                            }
                                        }

                                        .disst_item_box:hover {
                                            .disst_info {
                                                .disst_name_box {

                                                    .play_disst_btn {
                                                        z-index: 1;
                                                    }
                                                }
                                            }

                                            background: #e7e7e7;
                                        }
                                    }
                                }
                            }
                        }

                        .search_res_lyric {
                            .lyrics_box {
                                margin-top: 20px;

                                ul {
                                    list-style: none;

                                    li {
                                        .lyric_item_box {
                                            margin-top: 5px;
                                            position: relative;
                                            font-size: 14px;
                                            line-height: 28px;
                                            padding: 20px 0;
                                            border: 1px solid #e9e9e9;
                                            background: #f7f7f7;

                                            .lyric_song_info {
                                                padding: 0 80px;
                                                background: #dddddd24;
                                                width: 100%;
                                                height: 30px;

                                                .lyric_song_name {
                                                    float: left;
                                                    overflow: hidden;
                                                    text-overflow: ellipsis;
                                                    white-space: nowrap;
                                                    width: 40%;

                                                    .lyric_song_name_txt {
                                                        color: #000000;

                                                        em {
                                                            font-style: normal;
                                                            color: #ff938b;
                                                        }
                                                    }

                                                    .lyric_song_name_txt:hover {
                                                        transition: 0s;
                                                        color: #ff938b;
                                                        text-decoration: underline;
                                                    }
                                                }

                                                .lyric_play_song_icon {
                                                    float: left;
                                                    width: 10%;

                                                    .play_icon {
                                                        background: url(../../../resources/images/table.png) no-repeat 0 9999px;
                                                    }

                                                    .play_icon {
                                                        position: relative;
                                                        top: 2px;
                                                        display: inline-block;
                                                        width: 17px;
                                                        height: 17px;
                                                        margin-right: 15px;
                                                        cursor: pointer;
                                                        background-position: 0 -103px;
                                                    }

                                                    .play_icon:hover {
                                                        transition: 0s;
                                                        background-position: 0 -128px;
                                                    }
                                                }

                                                .lyric_singer_box {
                                                    float: left;
                                                    width: 20%;
                                                    overflow: hidden;
                                                    text-overflow: ellipsis;
                                                    white-space: nowrap;

                                                    .lyric_singer_name {
                                                        color: #000000;
                                                        margin-right: 5px;

                                                        em {
                                                            font-style: normal;
                                                            color: #ff938b;
                                                        }
                                                    }

                                                    .lyric_singer_name:hover {
                                                        transition: 0s;
                                                        color: #ff938b;
                                                        text-decoration: underline;
                                                    }
                                                }

                                                .lyric_album_box {
                                                    float: left;
                                                    width: 20%;
                                                    overflow: hidden;
                                                    text-overflow: ellipsis;
                                                    white-space: nowrap;

                                                    .lyric_album_name {

                                                        span {
                                                            color: #000000;
                                                        }

                                                        a {
                                                            color: #000000;

                                                            em {
                                                                font-style: normal;
                                                                color: #ff938b;
                                                            }
                                                        }
                                                    }

                                                    .lyric_album_name:hover {
                                                        a {
                                                            transition: 0s;
                                                            color: #ff938b;
                                                            text-decoration: underline;
                                                        }
                                                    }
                                                }

                                                .lyric_time_box {
                                                    float: right;
                                                    cursor: default;
                                                    color: #999999;
                                                }
                                            }

                                            .lyric_content_box {
                                                padding: 0 80px;

                                                .lyric_content {
                                                    height: 196px;
                                                    overflow: hidden;
                                                    color: #999;

                                                    p {
                                                        em {
                                                            font-style: normal;
                                                            color: #ff938b;
                                                        }
                                                    }
                                                }

                                                .lyric_content_max {
                                                    height: initial;
                                                }
                                            }

                                            .lyric_content_toolbar {
                                                margin-top: 10px;

                                                .icon {
                                                    display: inline-block;
                                                    margin-right: 6px;
                                                    background-image: url(../../../resources/images/icon_sprite.png);
                                                    background-image: -webkit-image-set(url(../../../resources/images/icon_sprite.png) 1x, url(../../../resources/images/icon_sprite@2x.png) 2x);
                                                    background-repeat: no-repeat;
                                                }

                                                .open_lyric_btn {
                                                    border-radius: 2px;
                                                    font-size: 14px;
                                                    margin-right: 6px;
                                                    padding: 0 23px;
                                                    height: 38px;
                                                    line-height: 38px;
                                                    display: inline-block;
                                                    white-space: nowrap;
                                                    box-sizing: border-box;
                                                    overflow: hidden;
                                                    border: 1px solid #c9c9c9;
                                                    color: #000;
                                                    cursor: pointer;

                                                    .more_icon {
                                                        width: 14px;
                                                        height: 14px;
                                                        background-position: -40px -80px;
                                                        vertical-align: -2px;
                                                    }
                                                }

                                                .open_lyric_btn:hover {
                                                    background-color: #ededed;
                                                    color: #333;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    .pageHelper {
                        text-align: center;
                        margin-top: 60px;
                    }

                    .search_res_null {
                        height: 400px;
                        color: #000000;
                        padding: 105px 0;
                        text-align: center;

                        span {
                            color: #ff938b;
                        }
                    }
                }

                .search_first {
                    height: 400px;
                    color: #3a50ec;
                    padding: 105px 0;
                    text-align: center;
                }

                .loading_logo {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    margin: auto;
                }

            }
        }
    }
</style>
