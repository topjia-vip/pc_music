<template>
    <Content class="song_detail">
        <div class="song_detail_main" v-if="loadOK" v-show="isShow">
            <div class="song_detail_content">
                <div class="song_detail_header">
                    <div class="song_detail_img_box">
                        <img class="song_detail_img" :src="songInfo.song.image" :alt="songInfo.song.name">
                    </div>
                    <div class="song_detail_content_box">
                        <div class="song_detail_song_name">
                            <h1 class="song_detail_song_name_txt">{{songInfo.song.name}}</h1>
                        </div>
                        <div class="song_detail_song_singer">
                            <i class="sprite song_detail_song_singer_icon"/>
                            <a class="song_detail_song_singer_name" v-for="(singer) in songInfo.song.singers"
                               :key="singer.singerId"
                               :title="singer.singerName"
                               @click="selectSinger(singer)"
                            >
                                {{singer.singerName}}
                            </a>
                        </div>
                        <ul class="song_detail_song_info_box">
                            <li class="song_detail_song_info_item even">
                                专辑：
                                <span v-for="(item,index) in songInfo.album"
                                      :key="index"
                                      :title="item"
                                >
                                    {{item}}
                                </span>
                            </li>
                            <li class="song_detail_song_info_item">
                                语种：
                                <span v-for="(item,index) in songInfo.lan"
                                      :key="index"
                                      :title="item"
                                >
                                    {{item}}
                                </span>
                            </li>
                            <li class="song_detail_song_info_item even">
                                流派：
                                <span v-for="(item,index) in songInfo.genre"
                                      :key="index"
                                      :title="item"
                                >
                                    {{item}}
                                </span>
                            </li>
                            <li class="song_detail_song_info_item">
                                唱片公司：
                                <span v-for="(item,index) in songInfo.company"
                                      :key="index"
                                      :title="item"
                                >
                                    {{item}}
                                </span>
                            </li>
                            <li class="song_detail_song_info_item even">
                                发行时间：
                                <span v-for="(item,index) in songInfo.pub_time"
                                      :key="index"
                                      :title="item"
                                >
                                    {{item}}
                                </span>
                            </li>
                        </ul>
                        <div class="play_song_btn_box">
                            <div class="mod_songlist_toolbar" @click="playSong">
                                <div class="mod-btn play-btn">
                                    <i class="play_icon"/>
                                    播放
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="song_detail_layout" v-if="songDetailLyric">
                    <div class="song_detail_lyric">
                        <div class="song_detail_lyric_hd">
                            <h2 class="song_detail_lyric_hd_title">歌词</h2>
                            <a data-clipboard-target="#content"
                               class="sprite copy_lyric_btn "
                               title="复制歌词"
                               @click="copy"
                            />
                        </div>
                        <div class="song_detail_lyric_content_box">
                            <div id="content" :class="openLyric?'':'song_detail_lyric_content'">
                                <p v-for="(item,index) in songDetailLyric" v-html="item" :key="index"/>
                            </div>
                            <a class="more_lyric" @click="openLyric =!openLyric">[{{openLyric?'收起':'展开'}}]</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <m-footer v-show="isShow"/>
        <loading v-show="!isShow"/>
    </Content>
</template>

<script>
import ViewUI, { Content, Message } from 'view-design'
import Clipboard from 'clipboard'
import Loading from '../../baes/loading/loading'
import MFooter from '../../baes/footer/m-footer'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { songDetail, songDetailLyric } from '../../api/song'
import { ERR_OK } from '../../api/config'
import { _normalizeSongs } from '../../common/js/util'

export default {
  name: 'song_detail',
  components: {
    MFooter,
    Loading,
    Content,
    Message
  },
  data () {
    return {
      isShow: false,
      loadOK: false,
      songInfo: {},
      songDetailLyric: [],
      openLyric: false
    }
  },
  computed: {
    ...mapGetters([
      'currentSong'
    ])
  },
  created () {
    if (!this.currentSong) {
      this.$router.replace('/recommend')
    } else {
      this._initSongInfo()
    }
  },
  methods: {
    copy () {
      let clipboard = new Clipboard('.copy_lyric_btn')
      clipboard.on('success', function (e) {
        Message.success({
          content: `歌词复制成功`,
          duration: 2
        })
        e.clearSelection()
      })
      clipboard.on('error', function (e) {
        Message.error({
          content: `歌词复制失败`,
          duration: 2
        })
      })
    },
    playSong () {
      this.insertSong(this.songInfo.song)
    },
    selectSinger (singer) {
      this.setCurrentSinger(singer)
      this.$router.push({
        path: `/singer_detail/${singer.singerMid}`
      })
    },
    async _initSongInfo () {
      ViewUI.LoadingBar.start()
      this.isShow = false
      let songInfo = await songDetail(this.currentSong.id, this.currentSong.mid)
      if (songInfo.code === ERR_OK) {
        let songList = []
        songList.push(songInfo.songInfo.song)
        songList = _normalizeSongs(songList)
        songInfo.songInfo.song = songList[0]
        this.songInfo = songInfo.songInfo
      }
      let songLyric = await songDetailLyric(this.currentSong.id)
      if (songLyric.code === ERR_OK) {
        if (songLyric.lyric[0]) {
          this.songDetailLyric = this.handleLyric(songLyric.lyric)
        } else {
          this.songDetailLyric = null
        }
      }
      this.isShow = true
      this.loadOK = true
      ViewUI.LoadingBar.finish()
    },
    handleLyric (lyric) {
      return lyric[0].split(/\[.*?\]/)
    },
    ...mapActions([
      'insertSong'
    ]),
    ...mapMutations({
      setCurrentSinger: 'SET_CURRENT_SINGER'
    })
  },
  watch: {
    currentSong () {
      this._initSongInfo()
    }
  }
}
</script>

<style lang="less">
    .song_detail {
        position: relative;
        height: 100%;
        min-width: 900px;
        background: linear-gradient(#f4f4f4, #fff);

        .song_detail_main {
            position: relative;
            min-width: 900px;
            margin: 0 50px;

            .song_detail_content {
                max-width: 1200px;
                min-height: 700px;
                margin-left: auto;
                margin-right: auto;
                position: relative;

                .sprite {
                    background-image: url(../../resources/images/icon_sprite.png);
                    background-image: -webkit-image-set(url(../../resources/images/icon_sprite.png) 1x, url(../../resources/images/icon_sprite@2x.png) 2x);
                }

                .song_detail_header {
                    position: relative;
                    height: 250px;
                    padding-left: 305px;
                    margin-top: 40px;
                    margin-bottom: 35px;

                    .song_detail_img_box {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 250px;
                        height: 250px;

                        .song_detail_img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }

                    .song_detail_content_box {
                        padding-top: 13px;

                        .song_detail_song_name {
                            overflow: hidden;
                            height: 50px;
                            line-height: 50px;

                            .song_detail_song_name_txt {
                                float: left;
                                font-size: 31px;
                                line-height: 50px;
                                font-weight: 400;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                max-width: 70%;
                                margin-right: 10px;
                                color: #000000;
                            }
                        }

                        .song_detail_song_singer {
                            height: 24px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            max-width: 90%;

                            .song_detail_song_singer_icon {
                                float: left;
                                width: 16px;
                                height: 16px;
                                background-position: -20px -240px;
                                margin: 2px 7px 0 0;
                            }

                            .song_detail_song_singer_name {
                                margin-right: 5px;
                                color: #000000;
                            }

                            .song_detail_song_singer_name:hover {
                                color: #ff938b;
                            }
                        }

                        .song_detail_song_info_box {
                            width: 450px;
                            overflow: hidden;
                            padding-top: 8px;

                            .song_detail_song_info_item {
                                color: #000000;
                                cursor: default;
                                float: left;
                                line-height: 27px;
                                width: 166px;
                                margin-right: 10px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                font-size: 14px;
                            }

                            .even {
                                width: 250px;
                            }
                        }

                        .play_song_btn_box {
                            position: absolute;
                            bottom: 23px;
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

                                .play_icon {
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

                            .play-btn {
                                min-width: 122px;
                                text-align: center;
                                padding: 0 18px;
                                user-select: none;
                                cursor: pointer;
                                background-color: #2d90f4;
                                color: #ffffff;
                            }

                            .play-btn:hover {
                                background: #0a84c3;
                                color: #ffffff;
                            }
                        }
                    }
                }

                .song_detail_layout {
                    width: 100%;
                    padding-bottom: 20px;

                    .song_detail_lyric {
                        .song_detail_lyric_hd {
                            overflow: hidden;
                            line-height: 46px;

                            .song_detail_lyric_hd_title {
                                float: left;
                                font-size: 20px;
                                font-weight: 400;
                                margin-right: 10px;
                                color: #000000;
                            }

                            .copy_lyric_btn {
                                float: left;
                                width: 16px;
                                height: 16px;
                                background-position: -100px -40px;
                                margin-top: 15px;
                                overflow: hidden;
                            }
                        }

                        .song_detail_lyric_content_box {
                            font-size: 14px;
                            color: #000;
                            line-height: 26px;
                            margin-bottom: 40px;

                            .song_detail_lyric_content {
                                max-height: 390px;
                                overflow: hidden;
                            }

                            .more_lyric {
                                color: #ff938b;
                            }
                        }
                    }
                }
            }
        }
    }

</style>
