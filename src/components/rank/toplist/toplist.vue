<template>
    <div>
        <div class="top-list" v-show="isShow" v-if="topDetail.top_song_list && topDetail.top_song_list.length>0">
            <div class="toplist-hd">
                <h1 class="toplist-title">{{topDetail.topDetail.topTitle}}</h1>
                <span class="toplist-switch">
                    <a class="toplist_switch__btn" v-if="topDetail.topDetail.topHistory.subPeriod.length>0"
                       :class="isDisable(period,'prev')"
                       @click="changeList(period,'prev')"
                       title="上一期"
                    >
                        <i class="toplist_switch__arrow_prev sprite"/>
                    </a>
                    <span class="toplist-switch-data">{{setSwitchData(topDetail.topDetail)}}</span>
                    <a class="toplist_switch__btn" v-if="topDetail.topDetail.topHistory.subPeriod.length>0"
                       :class="isDisable(period,'next')"
                       @click="changeList(period,'next')"
                       title="下一期"
                    >
                        <i class="toplist_switch__arrow_next sprite"/>
                    </a>
                </span>
            </div>
            <div class="mod_songlist_toolbar">
                <div class="mod-btn play-all-btn" @click="playTopList">
                    <i class="play_all_icon"/>
                    播放全部
                </div>
            </div>
            <div class="mod_songlist">
                <ul class="songlist__header">
                    <li class="songlist__header_name">歌曲</li>
                    <li class="songlist__header_author">歌手</li>
                    <li class="songlist__header_time">时长</li>
                </ul>
                <ul class="song_list">
                    <li v-for="(song,index) in curSongList"
                        :style="((index+1)%2)===0?'background: #99999912;':''"
                        :key="song.mid"
                    >
                        <div class="song_list-item">
                            <div class="songlist_number" :class="((curPage-1)*30+index)<3?'songlist_number_top':''">
                                {{(curPage-1)*30+index+1}}
                            </div>
                            <div class="songlist_rank">
                                <i :class="handleRankClass(topDetail.topDetail.song[index])"></i>
                                {{handleRank(topDetail.topDetail.song[index])}}
                            </div>
                            <div class="song_name">
                                <a class="song_link">
                                    <img class="song_img" @click="songDetail(song)" :src="song.image" :alt="song.name"
                                         :title="song.name" :onerror="errorImage">
                                </a>
                                <a class="song_title" @click="songDetail(song)" :title="`${song.title+song.subTitle}`">
                                    {{song.title}}
                                    <span class="song_name_title" v-if="song.subTitle">{{song.subTitle}}</span>
                                </a>
                            </div>
                            <div class="song_singer">
                                <a class="singer_link"
                                   :title="singer.singerName"
                                   v-for="(singer) in song.singers"
                                   :key="singer.mid"
                                   @click="selectSinger(singer)"
                                >
                                    {{singer.singerName}}
                                </a>
                            </div>
                            <div class="song_time">{{_handleTime(song.duration)}}</div>
                            <div class="menu">
                                <div class="play_icon" title="播放" @click="selectItem(song)"></div>
                                <div class="add_icon" title="添加"></div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="pageHelper">
                    <Page :current="curPage"
                          :total="topDetail.top_song_list.length"
                          :page-size="30" show-elevator
                          @on-change="changePage"/>
                </div>
            </div>
        </div>
        <div class="loading-box" v-show="!isShow"></div>
        <svg class="loading_logo" v-show="!isShow" xmlns="http://www.w3.org/2000/svg"
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
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { Page } from 'view-design'
import { initTopDetail } from '../../../api/rank'
import { ERR_OK } from '../../../api/config'
import { getDateByYearAndWeek, handleTime, _normalizeSongs } from '../../../common/js/util'

export default {
  name: 'toplist',
  props: {
    id: {
      type: Number
    }
  },
  components: {
    Page
  },
  computed: {
    ...mapGetters([
      'currentTop'
    ])
  },
  data () {
    return {
      topDetail: {},
      period: '',
      curSongList: [],
      type: true,
      pageData: [],
      curPage: 1,
      isShow: false,
      errorImage: 'this.src="' + require('../../../resources/images/img.png') + '"'
    }
  },
  methods: {
    // 查看歌曲详情
    songDetail (song) {
      this.setCurrentSong(song)
      this.$router.push({
        path: `/songinfo/${song.id}`
      })
    },
    selectSinger (singer) {
      this.setCurrentSinger(singer)
      this.$router.push({
        path: `/singer_detail/${singer.singerMid}`
      })
    },
    selectItem (song) {
      this.insertSong(song)
    },
    playTopList () {
      this.selectPlay(
        {
          list: this.pageData[this.curPage - 1],
          index: 0
        }
      )
    },
    _initTopDetail () {
      this.isShow = false
      initTopDetail(this.currentTop.topId, this.currentTop.period).then(res => {
        if (res.code === ERR_OK) {
          // 处理歌曲信息
          const newSongList = _normalizeSongs(res.topDetail.top_song_list)
          res.topDetail.top_song_list = newSongList
          this.topDetail = res.topDetail
          this.period = this.topDetail.topDetail.period
          this.handlePage(res.topDetail.top_song_list)
          this.curSongList = this.pageData[0]
          this.isShow = true
        }
      })
    },
    _handleTime (duration) {
      return handleTime(duration)
    },
    setSwitchData (topDetail) {
      if (topDetail.topHistory.year.length > 0) {
        return this.handleData(this.period)
      } else {
        return this.period
      }
    },
    handleData (date) {
      const year = date.split('_')[0]
      const week = date.split('_')[1]
      date = getDateByYearAndWeek(year, week)
      return `${date.left.month}.${date.left.day}-${date.right.month}.${date.right.day}`
    },
    handleRankClass (songType) {
      const type = songType.rankType
      if (type === 6) {
        return 'icon_rank_popular'
      } else if (type === 1) {
        return 'icon_rank_up'
      } else if (type === 2) {
        return 'icon_rank_down'
      } else if (type === 3) {
        return 'icon_rank_keep'
      } else if (type === 4) {
        return 'icon_rank_new'
      } else if (type === 5) {
        return 'icon_rank_re'
      }
    },
    handleRank (songType) {
      const type = songType.rankType
      if (type === 6) {
        return songType.rankValue
      } else if (type === 1) {
        return songType.rankValue
      } else if (type === 2) {
        return songType.rankValue
      } else if (type === 3) {
        return ''
      } else if (type === 4) {
        return ''
      } else if (type === 5) {
        return ''
      }
    },
    handlePage (topSongList) {
      const conunt = Math.ceil(topSongList.length / 30)
      for (let i = 0; i < conunt; i++) {
        this.pageData[i] = topSongList.slice(i * 30, i * 30 + 30)
      }
    },
    changePage (curPage) {
      this.$emit('toTop')
      this.curPage = curPage
      this.curSongList = this.pageData[curPage - 1]
    },
    isDisable (period, type) {
      const curYear = period.split('_')[0]
      const index = this.topDetail.topDetail.topHistory.year.findIndex(item => item === parseInt(curYear))
      const curWeak = period.split('_')[1]
      const windex = this.topDetail.topDetail.topHistory.subPeriod[index].findIndex(item => item === parseInt(curWeak))
      // 如果年份的索引值不是第一个或者最后一个 那么就可以执行上一页和下一页
      if (index !== 0 && index !== this.topDetail.topDetail.topHistory.year.length - 1) {
        return ''
      } else if (index === 0) {
        // 如果是最新的年份上一页一定可以点击
        if (type === 'prev') {
          return ''
        } else {
          // 判断当前的月份是否是最新的，如果是则下一页无法点击
          if (windex === 0) {
            return 'toplist_switch__btn--disable'
          } else {
            return ''
          }
        }
      } else if (index === this.topDetail.topDetail.topHistory.year.length - 1) {
        // 如果是最老的年份 那么下一页一定可以点击
        if (type === 'next') {
          return ''
        } else {
          // 判断当前的月份是否是最老的，如果是则上一页无法点击
          if (windex === this.topDetail.topDetail.topHistory.subPeriod[index].length - 1) {
            return 'toplist_switch__btn--disable'
          } else {
            return ''
          }
        }
      }
    },
    changeList (period, type) {
      const topDetail = this.topDetail.topDetail
      const curYear = period.split('_')[0]
      const index = topDetail.topHistory.year.findIndex(item => item === parseInt(curYear))
      const curWeak = period.split('_')[1]
      const windex = topDetail.topHistory.subPeriod[index].findIndex(item => item === parseInt(curWeak))
      // 如果年份的索引值不是第一个或者最后一个 那么就可以执行上一页和下一页
      if (index !== 0 && index !== topDetail.topHistory.year.length - 1) {
        if (type === 'next') {
          // 点击下一页 如果是最后一期，将跳转到下一年的第一期
          if (windex === 0) {
            this.period = topDetail.topHistory.year[index - 1] + '_' +
              topDetail.topHistory.subPeriod[index - 1][topDetail.topHistory.subPeriod[index - 1].length - 1]
          } else {
            // 正常下一页
            this.period = curYear + '_' + topDetail.topHistory.subPeriod[index][windex - 1]
          }
        } else {
          // 点击上一页 如果是第一期，将跳转到上一年的第最后一期
          if (windex === topDetail.topHistory.subPeriod[index].length - 1) {
            this.period = topDetail.topHistory.year[index + 1] + '_' + topDetail.topHistory.subPeriod[index + 1][0]
          } else {
            // 正常上一页
            this.period = curYear + '_' + topDetail.topHistory.subPeriod[index][windex + 1]
          }
        }
      } else if (index === 0) {
        // 如果是最新的年份上一页一定可以点击
        if (type === 'prev') {
          // 点击上一页 如果是第一期，将跳转到上一年的第最后一期
          if (windex === topDetail.topHistory.subPeriod[index].length - 1) {
            this.period = topDetail.topHistory.year[index + 1] + '_' + topDetail.topHistory.subPeriod[index + 1][0]
          } else {
            // 正常上一页
            this.period = curYear + '_' + topDetail.topHistory.subPeriod[index][windex + 1]
          }
        } else {
          // 判断当前的月份是否是最新的，如果是则下一页无法点击
          if (windex === 0) {
            return
          } else {
            // 点击下一页 如果是最后一期，将跳转到下一年的第一期
            if (windex === 0) {
              this.period = topDetail.topHistory.year[index - 1] + '_' +
                topDetail.topHistory.subPeriod[index - 1][topDetail.topHistory.subPeriod[index - 1].length - 1]
            } else {
              // 正常下一页
              this.period = curYear + '_' + topDetail.topHistory.subPeriod[index][windex - 1]
            }
          }
        }
      } else if (index === this.topDetail.topDetail.topHistory.year.length - 1) {
        // 如果是最老的年份 那么下一页一定可以点击
        if (type === 'next') {
          // 点击下一页 如果是最后一期，将跳转到下一年的第一期
          if (windex === 0) {
            this.period = topDetail.topHistory.year[index - 1] + '_' +
              topDetail.topHistory.subPeriod[index - 1][topDetail.topHistory.subPeriod[index - 1].length - 1]
          } else {
            // 正常下一页
            this.period = curYear + '_' + topDetail.topHistory.subPeriod[index][windex - 1]
          }
        } else {
          // 判断当前的月份是否是最老的，如果是则上一页无法点击
          if (windex === this.topDetail.topDetail.topHistory.subPeriod[index].length - 1) {
            return
          } else {
            // 点击上一页 如果是第一期，将跳转到上一年的第最后一期
            if (windex === topDetail.topHistory.subPeriod[index].length - 1) {
              this.period = topDetail.topHistory.year[index + 1] + '_' + topDetail.topHistory.subPeriod[index + 1][0]
            } else {
              // 正常上一页
              this.period = curYear + '_' + topDetail.topHistory.subPeriod[index][windex + 1]
            }
          }
        }
      }
      this.isShow = false
      initTopDetail(this.currentTop.topId, this.period).then(res => {
        if (res.code === ERR_OK) {
          const newSongList = _normalizeSongs(res.topDetail.top_song_list)
          res.topDetail.top_song_list = newSongList
          this.topDetail = res.topDetail
          this.handlePage(res.topDetail.top_song_list)
          this.curSongList = this.pageData[0]
          this.isShow = true
        }
      })
    },
    ...mapActions([
      'selectPlay',
      'insertSong'
    ]),
    ...mapMutations({
      setCurrentSinger: 'SET_CURRENT_SINGER',
      setCurrentSong: 'SET_CURRENT_SONG'
    })
  },
  watch: {
    currentTop () {
      this.curPage = 1
      this._initTopDetail()
    }
  }
}
</script>

<style scoped lang="less">
    .top-list {
        margin-left: 268px;
        margin-top: 20px;
        min-width: 900px;

        .toplist-hd {
            user-select: none;
            line-height: 64px;
            height: 64px;
            margin-bottom: 10px;

            .toplist-title {
                float: left;
                font-weight: 400;
                color: #000;
                font-size: 24px;
                margin-right: 15px;
            }

            .toplist-switch {
                margin-right: 15px;
                font-size: 0;

                .toplist_switch__btn {
                    display: inline-block;
                    vertical-align: middle;
                    width: 17px;
                    height: 23px;
                    overflow: hidden;

                    .sprite {
                        display: block;
                        width: 7px;
                        height: 12px;
                        background-image: url(../../../resources/images/icon_sprite.png);
                        background-image: -webkit-image-set(url(../../../resources/images/icon_sprite.png) 1x, url(../../../resources/images/icon_sprite@2x.png) 2x);
                    }

                    .toplist_switch__arrow_prev {
                        margin-left: 3px;
                        background-position: -160px -40px;
                    }

                    .toplist_switch__arrow_next {
                        margin-left: 7px;
                        background-position: -120px -40px;
                    }

                }

                .toplist_switch__btn:hover {
                    .toplist_switch__arrow_next {
                        background-position: -120px -60px;
                    }

                    .toplist_switch__arrow_prev {
                        background-position: -160px -60px;
                    }
                }

                .toplist_switch__btn--disable {
                    opacity: .4;
                    pointer-events: none;
                    cursor: default;
                }

                .toplist-switch-data {
                    font-size: 14px;
                    width: 100px;
                }
            }
        }

        .mod_songlist_toolbar {
            position: relative;
            margin-bottom: 20px;
            font-size: 0;

            .mod-btn {
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

                .play_all_icon {
                    width: 13px;
                    height: 16px;
                    background-position: -80px -220px;
                    vertical-align: -3px;
                    display: inline-block;
                    margin-right: 6px;
                    background-image: url(../../../resources/images/icon_sprite.png);
                    background-image: -webkit-image-set(url(../../../resources/images/icon_sprite.png) 1x, url(../../../resources/images/icon_sprite@2x.png) 2x);
                    background-repeat: no-repeat;
                }

            }

            .play-all-btn {
                user-select: none;
                cursor: pointer;
                background-color: #2d90f4;
                color: #ffffff;
            }

            .play-all-btn:hover {
                background: #0a84c3;
                color: #ffffff;
            }
        }

        .mod_songlist {

            .songlist__header {
                list-style: none;
                padding-left: 122px;
                height: 50px;
                line-height: 50px;
                background-color: rgba(0, 0, 0, .01);
                color: #999;

                .songlist__header_name {
                    float: left;
                    width: 45%;
                }

                .songlist__header_author {
                    float: left;
                    padding-left: 15px;
                    width: 30%;
                    box-sizing: border-box;
                }

                .songlist__header_time {
                    float: left;
                    width: 50px;
                }
            }

            .song_list {
                overflow: hidden;
                list-style: none;

                .song_list-item {
                    height: 80px;
                    padding-left: 122px;

                    .songlist_number {
                        position: absolute;
                        width: 40px;
                        left: 268px;
                        height: 80px;
                        line-height: 80px;
                        text-align: right;
                        font-size: 24px;
                        color: #333;
                    }

                    .songlist_number_top {
                        color: #ff4222
                    }

                    .songlist_rank {
                        position: absolute;
                        left: 308px;
                        width: 72px;
                        height: 80px;
                        font-size: 12px;
                        line-height: 20px;
                        text-align: center;
                        color: #999;

                        .icon_rank_popular, .icon_rank_up, .icon_rank_down, .icon_rank_keep, .icon_rank_new, .icon_rank_re {
                            display: block;
                            margin-left: auto;
                            margin-right: auto;
                            background-image: url(../../../resources/images/icon_rank.png);
                            background-image: -webkit-image-set(url(../../../resources/images/icon_rank.png) 1x, url(../../../resources/images/icon_rank@2x.png) 2x);
                        }

                        .icon_rank_popular {
                            width: 15px;
                            height: 15px;
                            margin-top: 27px;
                            background-position: 0 -60px;
                        }

                        .icon_rank_up {
                            width: 14px;
                            height: 13px;
                            margin-top: 28px;
                            background-position: 0 0;
                        }

                        .icon_rank_down {
                            width: 14px;
                            height: 13px;
                            margin-top: 28px;
                            background-position: 0 -15px;
                        }

                        .icon_rank_keep {
                            width: 14px;
                            height: 3px;
                            margin-top: 38px;
                            background-position: 0 -30px;
                        }

                        .icon_rank_new {
                            width: 23px;
                            height: 8px;
                            margin-top: 36px;
                            background-position: 0 -40px;
                        }

                        .icon_rank_re {
                            width: 14px;
                            height: 8px;
                            margin-top: 36px;
                            background-position: 0 -50px;
                        }

                    }

                    .song_name {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        float: left;
                        width: 45%;

                        .song_link {
                            position: relative;
                            float: left;
                            width: 60px;
                            height: 60px;
                            margin-right: 10px;
                            margin-top: 10px;

                            .song_img {
                                width: 60px;
                                height: 60px;
                                display: block;
                                visibility: visible;
                            }
                        }

                        .song_title {
                            position: relative;
                            cursor: pointer;
                            line-height: 80px;
                            color: #333333;

                            .song_name_title {
                                color: #999;
                                margin-left: 10px;
                            }
                        }

                        .song_title:hover {
                            color: #ff938b;
                        }

                    }

                    .menu {
                        opacity: 0;
                        float: left;
                        height: 80px;
                        width: 15%;
                        margin-left: 30px;
                        padding-left: 10px;

                        .play_icon, .add_icon {
                            display: block;
                            width: 36px;
                            height: 36px;
                            background-image: url(../../../resources/images/icon_list_menu.png);
                            background-image: -webkit-image-set(url(../../../resources/images/icon_list_menu.png) 1x, url(../../../resources/images/icon_list_menu@2x.png) 2x);
                            background-repeat: no-repeat;
                        }

                        .play_icon {
                            cursor: pointer;
                            position: relative;
                            float: left;
                            top: 22px;
                        }

                        .add_icon {
                            cursor: pointer;
                            position: relative;
                            float: left;
                            top: 22px;
                            margin-left: 10px;
                            background-position: 0 -80px;
                        }

                        .add_icon:hover {
                            background-position: -40px -80px;
                        }

                        .play_icon:hover {
                            background-position: -40px 0;
                        }
                    }

                    .song_singer {
                        float: left;
                        padding-left: 15px;
                        width: 30%;
                        box-sizing: border-box;
                        line-height: 80px;
                        height: 80px;
                        overflow: hidden;
                        text-overflow: ellipsis;

                        .singer_link {
                            margin-right: 5px;
                            color: #333333;
                        }

                        .singer_link:hover {
                            color: #ff938b;
                        }
                    }

                    .song_time {
                        float: left;
                        height: 80px;
                        line-height: 80px;
                        color: #999999;
                    }
                }

                .song_list-item:hover {
                    .menu {
                        opacity: 1;
                    }

                    background-color: rgba(153, 153, 153, 0.28);
                }
            }

            .pageHelper {
                position: relative;
                text-align: center;
                margin: 20px 0;
                line-height: 124px;
            }
        }
    }

    .loading-box {
        height: 2727px;
        margin-left: 268px;
        margin-top: 20px;
        min-width: 900px;
    }

    .loading_logo {
        position: fixed;
        top: 50%;
        left: 50%;
    }
</style>
