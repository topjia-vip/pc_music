<template>
    <Content class="singer_detail">
        <div class="singer_detail_main" v-show="isShow" v-if="loadOK">
            <div class="singer_detail_content">
                <div class="singer_detail_head">
                    <span class="singer_image_box">
                        <img class="singer_image"
                             :src="currentSinger.singerPic"
                             onerror="this.src='https://y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=2592000'"
                             :alt="currentSinger.singerName">
                    </span>
                    <div class="singer_detail_content_box">
                        <div class="singer_detail_name">
                            <h1 class="singer_detail_name_txt" :title="currentSinger.singerName">
                                {{currentSinger.singerName}}
                            </h1>
                        </div>
                        <div class="singer_detail_desc">
                            <div class="singer_detail_desc_txt">{{singerDetail.singerInfo.desc}}</div>
                            <div class="singer_detail_desc_more" @click="isShowDetail = !isShowDetail">[更多]</div>
                        </div>
                    </div>
                    <div class="singer_detail_songNum">
                        <div class="singer_detail_songNum_box">
                            <span class="singer_detail_songNum_tit">单曲</span>
                            <strong class="singer_detail_songNum_number">{{singerDetail.total}}</strong>
                        </div>
                    </div>
                    <div class="play_songs">
                        <div class="mod_songlist_toolbar" @click="playAllSong">
                            <div class="mod-btn play-all-btn">
                                <i class="play_all_icon"/>
                                播放歌手热门歌曲
                            </div>
                        </div>
                    </div>
                </div>
                <div class="singer_detail_songlist_box">
                    <div class="singer_detail_songlist_hd">
                        <h2 class="singer_detail_songlist_title">单曲&nbsp;&nbsp;{{singerDetail.total}}</h2>
                    </div>
                    <div class="singer_detail_song_list_box">
                        <ul class="singer_detail_song_list_header">
                            <li class="singer_detail_song_list_name">歌曲</li>
                            <li class="singer_detail_song_list_album">专辑</li>
                            <li class="singer_detail_song_list_time">时长</li>
                        </ul>
                        <ul class="singer_detail_songlist">
                            <li v-for="(song,index) in curSongList"
                                :key="index"
                                :style="(index+1) % 2 === 0?'background: rgba(153, 153, 153, 0.07)':''"
                                @click="addSong(song)"
                            >
                                <div class="singer_detail_songlist_item">
                                    <div class="singer_detail_songlist_number">{{index + 1}}</div>
                                    <div class="singer_detail_song_info">
                                        <div class="song_image" :title="song.name">
                                            <img class="image"
                                                 :src="song.image"
                                                 :alt="song.name"
                                                 :onerror="errorImage"
                                            >
                                        </div>
                                        <span class="song_name" :title="song.name">
                                            <a @click.stop="songDetail(song)">{{song.name}}</a>
                                        </span>
                                    </div>
                                    <div class="singer_detail_song_album">
                                        <span class="album_name" :title="song.album">{{song.album === null ? '该歌曲无专辑' : song.album}}</span>
                                    </div>
                                    <div class="singer_detail_song_time">{{_handleTime(song.duration)}}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="pageHelper">
                    <Page :current="curPage"
                          :total="singerDetail.songList.length"
                          :page-size="30" show-elevator
                          @on-change="changePage"/>
                </div>
                <div class="pop_singer_detail" v-show="isShowDetail">
                    <div class="pop_singer_detail_content">
                        <h3 class="pop_singer_detail_tit">歌手简介</h3>
                        <!--歌手基本信息-->
                        <p v-if="singerDetail.singerInfo && singerDetail.singerInfo.basic.length>0"
                           v-for="(txt,index) in singerDetail.singerInfo.basic"
                           :key="'base_'+index"
                        >
                            {{txt}}
                        </p>
                        <p>简介：</p>
                        <p v-if="singerDetail.singerInfo && singerDetail.singerInfo.desc!==''"
                           v-html="handleTxT(singerDetail.singerInfo.desc)"/>
                        <p v-if="singerDetail.singerInfo && singerDetail.singerInfo.desc.length>0"
                           v-for="(txt,index) in singerDetail.singerInfo.other"
                           :key="'other_'+index"
                           v-html="handleTxT(txt)"
                        />
                    </div>
                    <i class="icon"/>
                </div>
            </div>
        </div>
        <m-footer v-show="isShow"/>
        <loading v-show="!isShow"/>
    </Content>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ViewUI, { Content, Page } from 'view-design'
import { getSingerDetail } from '../../api/singer'
import { _normalizeSongs, handleTime } from '../../common/js/util'
import Loading from '../../baes/loading/loading'
import MFooter from '../../baes/footer/m-footer'
import { ERR_OK } from '../../api/config'

export default {
  name: 'singer-detail',
  components: {
    MFooter,
    Loading,
    Content,
    Page
  },
  data () {
    return {
      isShow: false,
      singerDetail: {},
      curSongList: [],
      pageData: [],
      curPage: 1,
      loadOK: false,
      isShowDetail: false,
      errorImage: 'this.src="' + require('../../resources/images/img.png') + '"'
    }
  },
  computed: {
    ...mapGetters([
      'currentSinger'
    ])
  },
  created () {
    document.addEventListener('mouseup', e => {
      const x = document.getElementsByClassName('pop_singer_detail')[0]
      const z = document.getElementsByClassName('singer_detail_desc_more')[0]
      if (x || z) {
        if (!x.contains(event.target) && !z.contains(event.target)) {
          this.isShowDetail = false
        }
      }
    })
    if (!this.currentSinger) {
      this.$router.replace('/recommend')
    } else {
      this._initSingerInfo()
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
    playAllSong () {
      this.selectPlay(
        {
          list: this.singerDetail.songList,
          index: 0
        }
      )
    },
    addSong (song) {
      this.insertSong(song)
    },
    _handleTime (duration) {
      return handleTime(duration)
    },
    handleTxT (txt) {
      if (!txt || txt === '') {
        return '该歌手暂无简介'
      }
      let res = `${txt.replace(/(\r\n|\n|\r)/gm, '<br />')}`
      return res
    },
    _initSingerInfo () {
      ViewUI.LoadingBar.start()
      this.isShow = false
      getSingerDetail(this.currentSinger.singerMid).then(res => {
        if (res.code === ERR_OK) {
          this.singerDetail = res.data
          this.singerDetail.songList = _normalizeSongs(res.data.songList)
          this.handlePage(this.singerDetail.songList)
          this.curSongList = this.pageData[0]
        }
        this.loadOK = true
        this.isShow = true
        ViewUI.LoadingBar.finish()
      })
    },
    handlePage (topSongList) {
      const conunt = Math.ceil(topSongList.length / 30)
      for (let i = 0; i < conunt; i++) {
        this.pageData[i] = topSongList.slice(i * 30, i * 30 + 30)
      }
    },
    changePage (curPage) {
      window.scrollTo(0, 0)
      this.curPage = curPage
      this.curSongList = this.pageData[curPage - 1]
    },
    ...mapMutations({
      setCurrentSong: 'SET_CURRENT_SONG'
    }),
    ...mapActions([
      'selectPlay',
      'insertSong'
    ])
  },
  watch: {
    currentSinger () {
      this.curPage = 1
      this._initSingerInfo()
    }
  }
}
</script>

<style lang="less">
    .singer_detail {
        position: relative;
        height: 100%;
        min-width: 900px;
        background: linear-gradient(#f4f4f4, #fff);

        .singer_detail_main {
            position: relative;
            min-width: 900px;
            margin: 0 50px;

            .singer_detail_content {
                max-width: 1200px;
                margin-left: auto;
                margin-right: auto;
                position: relative;

                .singer_detail_head {
                    position: relative;
                    height: 250px;
                    padding-left: 305px;
                    margin-top: 40px;
                    margin-bottom: 35px;

                    .singer_image_box {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 250px;
                        height: 250px;
                    }

                    .singer_image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 999px;
                    }

                    .singer_detail_content_box {
                        padding-top: 31px;

                        .singer_detail_name {
                            overflow: hidden;
                            line-height: 50px;

                            .singer_detail_name_txt {
                                float: left;
                                font-size: 38px;
                                font-weight: 400;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                max-width: 90%;
                                margin-right: 10px;
                                color: #000000;
                                cursor: default;
                            }
                        }

                        .singer_detail_desc {
                            font-size: 14px;
                            height: 50px;
                            line-height: 50px;
                            margin-bottom: 4px;

                            .singer_detail_desc_txt {
                                float: left;
                                max-width: 80%;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                margin-right: 2px;
                                color: #000000;
                                cursor: default;
                            }

                            .singer_detail_desc_more {
                                float: left;
                                user-select: none;
                                cursor: pointer;
                                color: #333333;
                            }

                            .singer_detail_desc_more:hover {
                                color: #ff938b;
                            }
                        }
                    }

                    .singer_detail_songNum {
                        height: 23px;
                        overflow: hidden;
                        font-size: 0;

                        .singer_detail_songNum_box {
                            cursor: default;
                            line-height: 23px;
                            display: inline-block;
                            text-align: center;
                            padding-right: 20px;
                            margin-right: 20px;
                            font-size: 18px;
                            color: #000000;

                            .singer_detail_songNum_number {
                                font-size: 25px;
                                font-weight: 400;
                                margin-left: 10px;
                            }
                        }
                    }

                    .play_songs {
                        position: absolute;
                        bottom: 31px;

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
                                background-image: url(../../resources/images/icon_sprite.png);
                                background-image: -webkit-image-set(url(../../resources/images/icon_sprite.png) 1x, url(../../resources/images/icon_sprite@2x.png) 2x);
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
                }

                .singer_detail_songlist_box {
                    min-height: 700px;
                    position: relative;
                    margin-bottom: 30px;

                    .singer_detail_songlist_hd {
                        overflow: hidden;
                        height: 60px;

                        .singer_detail_songlist_title {
                            float: left;
                            font-size: 24px;
                            font-weight: 400;
                            line-height: 58px;
                            color: #000000;
                        }
                    }

                    .singer_detail_song_list_box {
                        padding-bottom: 40px;

                        .singer_detail_song_list_header, .singer_detail_songlist_item {
                            list-style: none;
                            position: relative;
                            padding-left: 46px;
                            padding-right: 95px;
                        }

                        .singer_detail_song_list_header {
                            height: 50px;
                            line-height: 50px;
                            background-color: rgba(0, 0, 0, .01);
                            color: #999;
                        }

                        .singer_detail_song_list_name, .singer_detail_song_info {
                            float: left;
                            width: 47.685185%;
                            position: relative;
                            white-space: normal;
                        }

                        .singer_detail_song_list_album, .singer_detail_song_album {
                            float: left;
                            padding-left: 15px;
                            width: 25.5%;
                            box-sizing: border-box;
                        }

                        .singer_detail_song_list_time, .singer_detail_song_time {
                            position: absolute;
                            top: 0;
                            right: 38px;
                            width: 50px;
                        }

                        .singer_detail_songlist {
                            overflow: hidden;
                            clear: both;

                            .singer_detail_songlist_item {
                                height: 80px;
                                clear: both;
                                font-size: 0;
                                overflow: hidden;

                                .singer_detail_songlist_number, .singer_detail_song_info, .singer_detail_song_album, .singer_detail_song_time {
                                    line-height: 80px;
                                    height: 80px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    font-size: 14px;
                                }

                                .singer_detail_songlist_number {
                                    position: absolute;
                                    top: 0;
                                    left: 10px;
                                    color: #999;
                                    width: 36px;
                                }

                                .singer_detail_song_info {

                                    .song_image {
                                        float: left;
                                        width: 60px;
                                        height: 60px;
                                        margin-right: 10px;
                                        margin-top: 10px;

                                        .image {
                                            width: 100%;
                                            height: 100%;
                                            display: block;
                                        }
                                    }

                                    .song_name {
                                        max-width: 85%;
                                        box-sizing: border-box;
                                        float: left;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        margin-right: 8px;
                                        white-space: nowrap;
                                        font-size: 14px;

                                        a {
                                            color: #000;
                                            text-decoration: none;
                                        }

                                        a:hover {
                                            color: #ff938b;
                                        }
                                    }
                                }

                                .singer_detail_song_album {
                                    .album_name {
                                        cursor: pointer;
                                        color: #000000;
                                    }
                                }

                                .singer_detail_song_time {
                                    color: #999999;
                                }
                            }

                            .singer_detail_songlist_item:hover {
                                cursor: pointer;
                                background: #e7e7e7;
                            }
                        }

                    }
                }

                .pageHelper {
                    position: relative;
                    text-align: center;
                    margin: 20px 0;
                }

                .pop_singer_detail {
                    position: absolute;
                    display: block;
                    top: 128px;
                    right: 85px;
                    width: 580px;
                    background: #fff;
                    box-shadow: 0 0 4px rgba(0, 0, 0, .35);
                    border-radius: 4px;
                    z-index: 1000;

                    .pop_singer_detail_content {
                        max-height: 400px;
                        font-size: 14px;
                        line-height: 22px;
                        margin: 30px 5px 30px 10px;
                        overflow-y: auto;

                        .pop_singer_detail_tit, p {
                            margin: 0 24px 0 19px;
                            color: #000000;
                        }

                        .pop_singer_detail_tit {
                            line-height: 22px;
                            font-size: 20px;
                            font-weight: 400;
                            padding: 0 0 20px;
                        }

                        p {
                            min-height: 22px;
                            text-align: justify;
                            word-break: break-all;
                        }
                    }

                    .pop_singer_detail_content::-webkit-scrollbar {
                        /*滚动条整体样式*/
                        width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
                        height: 1px;
                    }

                    /*定义滚动条轨道 内阴影+圆角*/

                    .pop_singer_detail_content::-webkit-scrollbar-track-piece {
                        -webkit-border-radius: 2em;
                        -moz-border-radius: 2em;
                        border-radius: 2em;
                    }

                    /*定义滑块 内阴影+圆角*/

                    .pop_singer_detail_content::-webkit-scrollbar-thumb {
                        /*滚动条里面小方块*/
                        border-radius: 10px;
                        background-color: #ddd;
                    }

                    .icon {
                        background: url(../../resources/images/popup_arrow.png) 0 -17px no-repeat;
                    }

                    .icon {
                        position: absolute;
                        top: -11px;
                        right: 65px;
                        width: 17px;
                        height: 11px;
                        background-position: -11px 0;
                    }
                }
            }
        }
    }
</style>
