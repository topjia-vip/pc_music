<template>
    <div class="play_list_box" ref="playListBox">
        <div class="play_list_left">
            <div class="left_hd">
                <div class="title">
                    <h4 v-html="sequenceList.length>0?`播放列表(${sequenceList.length})`:'暂无播放歌曲'"/>
                </div>
                <div class="clear_all_list" @click="clearAll">
                    <span class="clear_icon"/>
                    清空
                </div>
            </div>
            <div v-if="playList.length>0" class="content">
                <ul class="list">
                    <li class="play_list_item" v-for="(song,index) in sequenceList"
                        :class="song.id === currentPlaySong.id?'play_list_item_playing':''"
                        :key="song.id"
                        @click="selectItem(song,index)"
                    >
                        <div class="playing_icon">
                            <img v-show="song.id === currentPlaySong.id && playStatus"
                                 class="play_icon"
                                 src="../../resources/images/wave.gif">
                        </div>
                        <div class="song_name">{{song.name}}</div>
                        <div class="singer_name_box">
                            <a class="singer_name" v-for="(singer) in song.singers"
                               :key="singer.id"
                               :title="singer.singerName"
                               @click.stop="selectSinger(singer)"
                            >
                                <span>{{singer.singerName}}</span>
                            </a>
                        </div>
                        <div class="song_time" v-html="_handleTime(song.duration)"></div>
                        <div class="play_btn">
                            <div class="dl_box" title="下载" @click.stop="openModal(song)">
                                <div class="play_list_download"></div>
                            </div>
                            <div class="del_box" @click.stop="deleteSong(song)" title="删除">
                                <div class="play_list_del_one"></div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else class="no_list_content">
                <div class="no_con_icon"></div>
                <span class="title">你还没有添加任何歌曲</span>
            </div>
        </div>
        <div class="play_list_right">
            <div class="song_name_box">
                <div class="song_name">
                    <h4 v-html="sequenceList.length>0?`${currentPlaySong.name}`:''"/>
                </div>
            </div>
            <div class="bg" :style="handleBackImg" :class="sequenceList.length>0?'bg_blur':''"></div>
            <div class="zhezhao"></div>
            <scroll v-if="currentLyric && currentLyric.lines.length>0" class="lyric_box" ref="lyricList"
                    :data="currentLyric && currentLyric.lines">
                <div class="lyric-wrapper">
                    <div v-if="currentLyric">
                        <p ref="lyricLine"
                           class="text"
                           :class="{'current': currentLineNum ===index}"
                           v-for="(line,index) in currentLyric.lines"
                           :key="index"
                           v-html="handleLyric(index)"/>
                    </div>
                </div>
            </scroll>
            <!--纯音乐提示-->
            <div v-else class="lyric_box">
                <div class="lyric-wrapper-cyy">
                    <div v-if="currentLyric">
                        <p ref="lyricLine" class="text">纯音乐，请欣赏</p>
                    </div>
                </div>
            </div>
        </div>
        <Modal
                v-model="isOpen"
                title="下载歌曲"
                @on-ok="download"
                @on-cancel="closeModal"
                ok-text="下载"
                :loading="loading"
                :transfer="false"
                :footer-hide="!canDownload"
                :mask-closable="!checkDownload"
                :closable="!checkDownload"
        >
            <div v-if="checkDownload" style="text-align: center;color: #19be6b;height: 88px">
                <span>正在检查该歌曲是否可以下载</span>
                <Icon type="ios-loading" style="-webkit-animation: ani-load-loop 1s linear infinite;
    animation: ani-load-loop 1s linear infinite;"/>
            </div>
            <div v-if="canDownload && !checkDownload">
                <div style="float: left;height: 32px;line-height: 32px;">
                    <span style="font-size: 14px">
                        文件名字：
                    </span>
                </div>
                <input style="width: 400px" :value="fileName" placeholder="输入文件名字" @input="changeInput"/>
            </div>
            <div v-if="!canDownload && !checkDownload" style="text-align: center;color: #ed4014;height: 88px">
                <div>
                    <span>很抱歉，该歌曲是QQ音乐付费歌曲，无法下载</span>
                    <br>
                    <br>
                    <span style="color: #19be6b">可以选择其他歌曲下载</span>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import { Modal, Icon } from 'view-design'
import { mapGetters, mapMutations } from 'vuex'
import { handleTime } from '../../common/js/util'
import scroll from '../scroll/scroll'
import { ERR_OK } from '../../api/config'
import { getSongPurl, downloadSong } from '../../api/song'

export default {
  name: 'mini-play-list',
  components: {
    scroll,
    Modal,
    Icon
  },
  props: {
    currentLyric: {
      type: Object
    },
    currentLineNum: {
      type: Number
    },
    currentLyricTrans: {
      type: Object
    }
  },
  data () {
    return {
      isOpen: false,
      fileName: '',
      downloadSong: {},
      downloadURL: {},
      loading: true,
      canDownload: false,
      checkDownload: false
    }
  },
  computed: {
    handleBackImg () {
      if (this.sequenceList.length > 0) {
        return `background-image: url("${this.currentPlaySong.image}");background-size: 100% 100%;`
      } else {
        return `background: #131313;`
      }
    },
    ...mapGetters([
      'playList',
      'sequenceList',
      'fullScreen',
      'currentPlaySong',
      'currentPlaySongIndex',
      'playStatus',
      'mode'
    ])
  },
  methods: {
    handleLyric (index) {
      if (this.currentLyricTrans) {
        return `${this.currentLyric.lines[index].txt}<br/>${this.currentLyricTrans.lines[index].txt === '//'
          ? ''
          : this.currentLyricTrans.lines[index].txt}`
      } else {
        return this.currentLyric.lines[index].txt
      }
    },
    changeInput (e) {
      this.fileName = e.target.value
    },
    download () {
      if (!this.fileName) {
        this.fileName = this.downloadSong.name
      }
      downloadSong(this.downloadURL).then(res => {
        this.loading = false
        this.isOpen = false
        this._downloadSong(res)
      })
    },
    // 下载文件
    _downloadSong (data) {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', `${this.fileName}.m4a`)

      document.body.appendChild(link)
      link.click()
    },
    closeModal () {
      this.downloadSong = null
      setTimeout(() => {
        this.fileName = ''
        this.checkDownload = false
        this.canDownload = false
      }, 200)
    },
    openModal (song) {
      this.isOpen = true
      this.checkDownload = true
      setTimeout(() => {
        getSongPurl(song.mid).then(res => {
          this.checkDownload = false
          if (res.code === ERR_OK) {
            if (res.songPlayUrl) {
              // 播放链接存在，可以下载歌曲
              this.canDownload = true
              this.fileName = song.name
              this.downloadURL = res.songPlayUrl
              this.downloadSong = song
            }
          }
        })
      }, 500)
    },
    selectSinger (singer) {
      this.setCurrentSinger(singer)
      this.$router.push({
        path: `/singer_detail/${singer.singerMid}`
      })
    },
    _handleTime (time) {
      return handleTime(time)
    },
    // 清空播放列表
    clearAll () {
      this.$emit('clearAll')
    },
    // 删除歌曲
    deleteSong (song) {
      this.$emit('deleteSong', song)
    },
    // 从播放列表中切换歌曲
    selectItem (item, index) {
      this.$emit('selectItem', item, index)
    },
    ...mapMutations({
      setCurrentSinger: 'SET_CURRENT_SINGER'
    })
  }
}
</script>

<style lang="less">
    .play_list_box {
        position: fixed;
        width: 950px;
        height: 400px;
        box-shadow: 1px -3px 9px 0px #888888;
        bottom: 80px;
        z-index: -100;
        opacity: 0;
        left: 0;
        right: 0;
        margin: 0 auto;

        .play_list_left {
            position: absolute;
            width: 600px;
            height: 100%;
            background: #000;
            border-right: 1px solid #ffffff70;

            .play_list_del_one, .play_list_download, .clear_icon, .no_con_icon {
                background: url(../../resources/images/playlist.png)
            }

            .left_hd {
                width: 100%;
                height: 50px;
                padding-left: 20px;
                border-bottom: 1px solid #ffffff70;

                .title {
                    float: left;
                    width: 90%;
                    line-height: 50px;
                    font-weight: 800;
                    color: #ccc;
                }

                .clear_all_list {
                    float: left;
                    width: 10%;
                    line-height: 50px;
                    text-align: center;
                    color: #ccc;
                    cursor: pointer;

                    .clear_icon {
                        position: relative;
                        top: 18px;
                        left: 3.5px;
                        float: left;
                        width: 13px;
                        height: 14px;
                        background-position: -51px 0;
                    }
                }

                .clear_all_list:hover {
                    .clear_icon {
                        background-position: -51px -20px;
                    }
                }
            }

            .content {
                background: #131313;
                width: 100%;
                height: 350px;

                .list {
                    list-style: none;
                    width: 100%;
                    height: 350px;
                    color: #ccc;
                    padding: 5px 0;
                    overflow-y: scroll;

                    .play_list_item {
                        height: 28px;
                        line-height: 28px;
                        font-size: 12px;

                        .playing_icon {
                            float: left;
                            height: 100%;
                            width: 30px;
                            text-align: center;
                        }

                        .song_name {
                            float: left;
                            width: 256px;
                            padding-left: 5px;
                        }

                        .singer_name_box {
                            float: left;
                            width: 150px;

                            .singer_name {
                                transition: 0s;
                                margin-right: 5px;

                                span {
                                    color: #9b9b9b;
                                }
                            }

                            .singer_name:hover {
                                span {
                                    text-decoration-line: underline;
                                }
                            }
                        }

                        .song_name, .singer_name_box {
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }

                        .song_time {
                            color: #666666;
                            float: left;
                        }

                        .play_btn {
                            float: left;
                            width: 100px;
                            height: 100%;
                            text-align: center;
                            padding-left: 10px;
                            display: none;

                            .dl_box {
                                height: 100%;
                                width: 20px;
                                float: left;
                                margin-left: 10px;

                                .play_list_download {
                                    float: left;
                                    position: relative;
                                    top: 7px;
                                    left: 3.5px;
                                    width: 14px;
                                    height: 14px;
                                    background-position: -57px -50px;
                                }
                            }

                            .del_box {
                                height: 100%;
                                width: 20px;
                                float: left;
                                margin-left: 10px;

                                .play_list_del_one {
                                    position: relative;
                                    top: 7px;
                                    left: 3.5px;
                                    float: left;
                                    width: 13px;
                                    height: 14px;
                                    background-position: -51px 0;
                                }
                            }

                            .del_box:hover {
                                .play_list_del_one {
                                    background-position: -51px -20px;
                                }
                            }

                            .dl_box:hover {
                                .play_list_download {
                                    background-position: -80px -50px;
                                }
                            }
                        }
                    }

                    .play_list_item:hover {
                        cursor: pointer;
                        background: #333333;
                        color: #FFFFFF;

                        .singer_name_box {
                            .singer_name {
                                span {
                                    color: #FFFFFF;
                                }
                            }
                        }

                        .song_time {
                            color: #FFFFFF;
                        }

                        .play_btn {
                            display: block;
                        }
                    }

                    .play_list_item_playing {
                        background: #333333;
                        color: #FFFFFF;

                        .singer_name_box {
                            .singer_name {
                                span {
                                    color: #FFFFFF;
                                }
                            }
                        }

                        .song_time {
                            color: #FFFFFF;
                        }
                    }
                }

                .list::-webkit-scrollbar {
                    /*滚动条整体样式*/
                    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
                    height: 1px;
                }

                /*定义滚动条轨道 内阴影+圆角*/

                .list::-webkit-scrollbar-track-piece {
                    background-color: #000000;
                    -webkit-border-radius: 2em;
                    -moz-border-radius: 2em;
                    border-radius: 2em;
                }

                /*定义滑块 内阴影+圆角*/

                .list::-webkit-scrollbar-thumb {
                    /*滚动条里面小方块*/
                    border-radius: 10px;
                    background-color: #bababa;
                }

                .list::-webkit-scrollbar-thumb:hover {
                    background-color: #999999;
                }

                .list::-webkit-scrollbar-thumb:active {
                    background-color: #666666;
                }
            }

            .no_list_content {
                background: #131313;
                width: 100%;
                height: 350px;
                text-align: center;

                .no_con_icon {
                    float: left;
                    display: inline-block;
                    position: relative;
                    top: 160.5px;
                    left: 218px;
                    width: 36px;
                    height: 29px;
                    margin-right: 3px;
                    background-position: -138px 0;
                    vertical-align: middle;
                }

                .title {
                    user-select: none;
                    cursor: default;
                    color: #f8f8f8;
                    font-size: 12px;
                    line-height: 350px;
                }
            }
        }

        .play_list_right {
            position: absolute;
            width: 350px;
            left: 600px;
            height: 100%;
            background: #000;

            .song_name_box {
                width: 100%;
                height: 50px;
                border-bottom: 1px solid #ffffff70;

                .song_name {
                    color: #f8f8f8;
                    text-align: center;
                    line-height: 50px;
                }
            }

            .bg {
                width: 100%;
                height: 350px;
            }

            .zhezhao {
                position: absolute;
                top: 50px;
                z-index: 101;
                width: 100%;
                height: 350px;
                background: #131313;
                opacity: .5;
            }

            .lyric_box {
                position: absolute;
                z-index: 102;
                top: 50px;
                width: 100%;
                height: 350px;
                overflow: hidden;
                cursor: grab;
                display: inline-block;
                vertical-align: top;

                .lyric-wrapper {
                    width: 100%;
                    padding: 20px 0;
                    cursor: grab;
                    overflow: hidden;

                    .text {
                        font-size: 12px;
                        color: #ffffff;
                        word-wrap: break-word;
                        text-align: center;
                        line-height: 32px;
                    }

                    .current {
                        font-size: 14px;
                        color: #ff938b;
                    }
                }

                .lyric-wrapper-cyy {
                    width: 100%;
                    padding: 20px 0;
                    overflow: hidden;
                    position: absolute;
                    top: 139px;

                    .text {
                        font-size: 14px;
                        color: #ffffff;
                        word-wrap: break-word;
                        text-align: center;
                        line-height: 32px;
                    }
                }
            }

            .bg_blur {
                -webkit-filter: blur(5px);
                -moz-filter: blur(5px);
                -o-filter: blur(5px);
                filter: blur(5px);
            }
        }

        .ivu-modal-content {
            border-radius: 0;
            top: 150px;

            .ivu-modal-header {
                border-bottom: none;
            }

            .ivu-modal-footer {
                border-top: none;
            }

            input {
                display: inline-block;
                height: 32px;
                line-height: 1.5;
                padding: 4px 7px;
                font-size: 14px;
                border: 1px solid #dcdee2;
                border-radius: 4px;
                color: #515a6e;
                background-color: #fff;
                background-image: none;
                position: relative;
                cursor: text;
                transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
            }
        }
    }
</style>
