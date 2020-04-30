<template>
    <div class="mini-player" ref="miniPlayer" @mouseleave="leave" @mouseenter="isEnter = true">
        <div class="showBar" @mouseenter="showPlayer"></div>
        <div class="lock" @mouseenter="showPlayer" @click="changeLock" title="解锁/锁定播放器[L]">
            <Icon v-if="lock" type="md-lock"/>
            <Icon v-else type="md-unlock"/>
        </div>
        <div class="currentLineLyric" v-if="showLyric">
            <h1>{{playingLyric}}</h1>
        </div>
        <div class="play_box">
            <div class="player_btn">
                <div class="perv" @click="perv" title="上一首[alt+←]"></div>
                <div :class="playStatus?'play_pause':'play'"
                     @click="changePlayStatus"
                     title="暂停/播放[空格]"
                ></div>
                <div class="next" @click="next" title="下一首[alt+→]"></div>
            </div>
            <div class="song_img_box" @click="openNormalPlayer">
                <img class="song_img"
                     :src="handleImg"
                     :alt="currentPlaySong.name"
                >
            </div>
            <div class="song_play">
                <div class="song_info">
                    <div class="song_name">{{currentPlaySong.name}}</div>
                    <div class="song_singer">
                        <span class="singer_name"
                              v-for="(singer) in currentPlaySong.singers"
                              :key="singer.id"
                              :title="singer.singerName"
                              @click="selectSinger(singer)"
                        >
                            {{singer.singerName}}
                        </span>
                    </div>
                </div>
                <div class="progress_bar" ref="progressBar" @click="progressClick($event,'song')">
                    <div class="bar-inner">
                        <div class="progress_load" ref="progress_load" :style="`width:${currentSongLoad}%`"></div>
                        <div class="progress" ref="progress"></div>
                        <div class="progress-btn-wrapper" ref="progressBtn"
                             @mousedown.prevent="progressTouchStart($event,'song')"
                        >
                            <div class="progress-btn">
                                <div v-show="sequenceList.length>0 && !canPlay">
                                    <svg class="song_lodaing" xmlns="http://www.w3.org/2000/svg"
                                         xmlns:xlink="http://www.w3.org/1999/xlink"
                                         width="30px" height="30px" viewBox="0 0 50 50"
                                         style="enable-background:new 0 0 50 50" xml:space="preserve">
                                            <path fill="#FF6700"
                                                  d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
                                                  transform="rotate(275.098 25 25)">
                                                <animateTransform attributeType="xml"
                                                                  attributeName="transform"
                                                                  type="rotate"
                                                                  from="0 25 25"
                                                                  to="360 25 25"
                                                                  dur="0.6s" repeatCount="indefinite"/>
                                            </path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="time_box">
                <span class="time current_play_time">{{format(currentTime)}}/</span>
                <span class="time song_time">{{format(currentPlaySong.duration)}}</span>
            </div>
            <div class="play_mod">
                <div :class="playMode" @click="changeMode" :title="ModeTitle"></div>
            </div>
            <div class="player_voice">
                <div class="voice" :class="voicePercent===0?'voice_btn_no':'voice_btn'"
                     @click.stop="isShowVoice = !isShowVoice"
                     title="音量"
                ></div>
                <div class="m_vol" v-show="isShowVoice">
                    <div class="voice_progress_bar" ref="voice_progress_bar"
                         @click="progressClick($event,'voice')"
                    >
                        <div class="voice_inner_bar">
                            <div class="voice_progress" ref="voice_progress"></div>
                            <div class="voice_progress-btn-wrapper" ref="voiceProgressBtn"
                                 @mousedown.prevent="progressTouchStart($event,'voice')"
                            >
                                <div class="voice_progress-btn"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="play_list_btn">
                <div class="play_list_btn_icon" title="播放列表[P]" @click="openPlayList"></div>
            </div>
            <div class="show_lyric_btn_box">
                <img class="show_lyric_btn" :src="handleBtnImg()" @click="changeShowLyric" title="显示/隐藏歌词[M]"/>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import defaultImg from '../../../resources/images/playlist_300.png'
import { playMode } from '../../../common/js/config'
import { prefixStyle } from '../../../common/js/dom'
import { Icon } from 'view-design'

const TYPE_SONG = 'song'
const TYPE_VOICE = 'voice'
const transform = prefixStyle('transform')
export default {
  name: 'mini-player',
  props: {
    currentTime: {
      type: Number
    },
    voicePercent: {
      type: Number
    },
    canPlay: {
      type: Boolean
    },
    percent: {
      type: Number
    },
    currentSongLoad: {
      type: Number
    },
    showPlayList: {
      type: Boolean
    },
    playingLyric: {
      type: String
    },
    lock: {
      type: Boolean
    },
    showLyric: {
      type: Boolean
    }
  },
  components: {
    Icon
  },
  data () {
    return {
      isShowVoice: false,
      isEnter: false
    }
  },
  created () {
    document.addEventListener('click', e => {
      const v = document.getElementsByClassName('m_vol')[0]
      if (v) {
        if (!v.contains(event.target)) {
          this.isShowVoice = false
        }
      }
    })
    this.touch = {}
    this.voiceTouch = {}
  },
  computed: {
    handleImg () {
      return this.sequenceList.length > 0 ? this.currentPlaySong.image : defaultImg
    },
    playMode () {
      return this.mode === playMode.sequence ? 'play_mod_list' : this.mode ===
      playMode.loop ? 'play_mod_single' : 'play_mod_random'
    },
    ModeTitle () {
      return this.mode === playMode.sequence ? '顺序播放[O]' : this.mode ===
      playMode.loop ? '单曲循环[O]' : '随机播放[O]'
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
  mounted () {
    this._offsetHeight(50)
    window.addEventListener('resize', () => {
      if (this.$refs.progressBar) {
        this._offset(this.$refs.progressBar.clientWidth * this.percent)
      }
    })
  },
  methods: {
    handleBtnImg () {
      return require('../../../resources/images/1.png')
    },
    leave () {
      this.isEnter = false
      this.hidePlayer()
    },
    hidePlayer () {
      if (!this.lock && !this.showPlayList) {
        this.$refs.miniPlayer.style.transition = '1s'
        this.$refs.miniPlayer.style.bottom = '-80px'
      }
    },
    showPlayer () {
      this.$refs.miniPlayer.style.transition = '0.5s'
      this.$refs.miniPlayer.style.bottom = '0px'
    },
    changeShowLyric () {
      this.$emit('changeShowLyric')
    },
    changeLock () {
      this.$emit('changeLock')
    },
    perv () {
      this.$emit('perv')
    },
    changePlayStatus () {
      this.$emit('changePlayStatus')
    },
    next () {
      this.$emit('next')
    },
    openNormalPlayer () {
      this.$emit('openNormalPlayer')
    },
    changeMode () {
      this.$emit('changeMode')
    },
    openPlayList () {
      this.$emit('openPlayList')
    },
    // 格式化时间
    format (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    // 拖拽滑条事件
    progressTouchStart (e, type) {
      if (type === TYPE_SONG) {
        if (this.sequenceList.length === 0 || !this.canPlay) {
          return
        }
        this.touch.initiated = true
        this.touch.startX = e.pageX
        this.touch.left = this.$refs.progress.clientWidth
        document.onmousemove = (e) => {
          if (!this.touch.initiated) {
            return
          }
          const deltaX = e.pageX - this.touch.startX
          const offsetWidth = Math.min(this.$refs.progressBar.clientWidth,
            Math.max(0, this.touch.left + deltaX))
          this._offset(offsetWidth)
          this.onProgressBarMove()
        }
        document.onmouseup = (e) => {
          this.touch.initiated = false
          this._triggerPercent()
          document.onmouseup = null
        }
      } else if (type === TYPE_VOICE) {
        this.voiceTouch.initiated = true
        this.voiceTouch.startY = e.pageY
        this.voiceTouch.bottom = this.$refs.voice_progress.clientHeight
        document.onmousemove = (e) => {
          if (!this.voiceTouch.initiated) {
            return
          }
          const deltaY = this.voiceTouch.startY - e.pageY
          const offsetHeight = Math.min(this.$refs.voice_progress_bar.clientHeight,
            Math.max(0, this.voiceTouch.bottom + deltaY))
          this._offsetHeight(offsetHeight)
          this._triggerVoicePercent()
        }
        document.onmouseup = (e) => {
          this.voiceTouch.initiated = false
          document.onmouseup = null
        }
      }
    },
    // 点击滑条事件
    progressClick (e, type) {
      if (type === TYPE_SONG) {
        if (this.sequenceList.length === 0 || !this.canPlay) {
          return
        }
        const rect = this.$refs.progressBar.getBoundingClientRect()
        if (e.pageX < rect.left || e.pageX > rect.right) {
          return
        }
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        this._triggerPercent()
      } else if (type === TYPE_VOICE) {
        const rect = this.$refs.voice_progress_bar.getBoundingClientRect()
        if (e.y < rect.top || e.y > rect.bottom) {
          return
        }
        const offsetHeight = rect.bottom - e.y
        this._offsetHeight(offsetHeight)
        this._triggerVoicePercent()
      }
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    },
    _offsetHeight (offsetHeight) {
      this.$refs.voice_progress.style.height = `${offsetHeight}px`
      this.$refs.voiceProgressBtn.style[transform] = `translate3d(0,${-offsetHeight}px,0)`
    },
    // 歌曲进度条操作
    _triggerPercent () {
      const barWidth = this.$refs.progressBar.clientWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('triggerPercent', percent)
    },
    // 进度条滑动时歌词跟随滑动
    onProgressBarMove () {
      const barWidth = this.$refs.progressBar.clientWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('onProgressBarMove', percent)
    },
    // 音量大小操作
    _triggerVoicePercent () {
      const barHeight = this.$refs.voice_progress_bar.clientHeight
      const voicePercent = this.$refs.voice_progress.clientHeight / barHeight
      this.$emit('triggerVoicePercent', voicePercent)
    },
    selectSinger (singer) {
      this.setCurrentSinger(singer)
      this.$router.push({
        path: `/singer_detail/${singer.singerMid}`
      })
    },
    ...mapMutations({
      setCurrentSinger: 'SET_CURRENT_SINGER'
    })
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    },
    showPlayList (newShowPlayList) {
      if (!newShowPlayList) {
        if (!this.isEnter) {
          this.hidePlayer()
        }
      } else {
        this.showPlayer()
      }
    },
    lock (newLock) {
      if (newLock) {
        this.showPlayer()
      } else {
        if (!this.isEnter) {
          this.hidePlayer()
        }
      }
    }
  }
}
</script>

<style lang="less">
    .mini-player {
        position: fixed;
        width: 100%;
        height: 80px;
        bottom: 0;
        z-index: 100;
        background: #333333;
        box-shadow: 0px -2px 5px #888888;
        opacity: 0.95;

        .showBar {
            width: 100%;
            height: 20px;
            position: absolute;
            top: -20px;
            z-index: 8;
        }

        .lock {
            width: 60px;
            height: 20px;
            background: #333333;
            position: relative;
            top: -20px;
            right: 10px;
            float: right;
            border-radius: 10px 10px 0 0;
            box-shadow: 0px -3px 5px #888888;
            opacity: 0.95;
            text-align: center;
            color: #ffffff80;
            cursor: pointer;
            z-index: 10;
        }

        .lock:hover {
            color: #ffffff;
        }

        .currentLineLyric {
            min-width: 900px;
            width: 100%;
            height: 40px;
            position: relative;
            top: -60px;
            float: left;
            cursor: default;
            user-select: none;
            text-align: center;
            line-height: 40px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            background: #00000061;
            z-index: 5;
            color: #fff;
        }

        .play_box {
            position: absolute;
            left: 0;
            right: 0;
            margin: 0 auto;
            min-width: 1400px;
            width: 1400px;
            height: 100%;
            padding-left: 73.5px;

            .player_btn {
                position: relative;
                float: left;
                height: 80px;
                width: 150px;
                padding: 10px 0;
                margin-right: 20px;

                .perv, .play, .next, .play_pause {
                    cursor: pointer;
                    position: absolute;
                    float: left;
                    background-image: url(../../../resources/images/player.png);
                    background-image: -webkit-image-set(url(../../../resources/images/player.png) 1x, url(../../../resources/images/player@2x.png) 2x);
                    opacity: .8;
                }

                .perv:hover, .play:hover, .next:hover, .play_pause:hover {
                    opacity: 1;
                }

                .perv {
                    top: 30px;
                    left: 0;
                    width: 19px;
                    height: 20px;
                    background-position: 0 -30px;
                }

                .play {
                    top: 26px;
                    left: 56px;
                    width: 21px;
                    height: 29px;
                    background-position: 0 0;
                }

                .play_pause {
                    top: 26px;
                    left: 56px;
                    width: 21px;
                    height: 29px;
                    background-position: -30px 0;
                }

                .next {
                    top: 30px;
                    left: 110px;
                    width: 19px;
                    height: 20px;
                    background-position: 0 -52px;
                }
            }

            .song_img_box {
                height: 80px;
                width: 60px;
                float: left;

                .song_img {
                    user-select: none;
                    cursor: pointer;
                    width: 60px;
                    height: 60px;
                    margin: 10px 0;
                    display: block;
                    float: left;
                }
            }

            .song_play {
                height: 100%;
                width: 800px;
                float: left;
                padding: 10px 20px;

                .song_info {
                    height: 50%;

                    .song_name {
                        max-width: 30%;
                        cursor: default;
                        float: left;
                        font-weight: 500;
                        color: #ffffff;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                    .song_singer {
                        max-width: 70%;
                        float: left;
                        padding-left: 30px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;

                        .singer_name {
                            cursor: pointer;
                            color: #999999;
                            font-size: 13px;
                            margin-right: 5px;
                        }
                    }
                }

                .progress_bar {
                    height: 50%;

                    .bar-inner {
                        cursor: pointer;
                        position: relative;
                        top: 10px;
                        height: 5px;
                        border-radius: 70px;
                        background: rgba(0, 0, 0, 0.3);

                        .progress_load {
                            position: absolute;
                            width: 0;
                            height: 100%;
                            border-radius: 20px;
                            background: #747474;
                            opacity: .7;
                        }

                        .progress {
                            width: 0;
                            height: 100%;
                            border-radius: 70px;
                            background: #f8f8f8;
                            opacity: .9;
                        }

                        .progress-btn-wrapper {
                            position: absolute;
                            left: -16px;
                            top: -12px;
                            width: 30px;
                            height: 30px;

                            .progress-btn {
                                float: left;
                                cursor: pointer;
                                position: relative;
                                box-sizing: border-box;
                                top: 7px;
                                left: 7px;
                                width: 16px;
                                height: 16px;
                                border-radius: 50%;
                                background: #ffffff;

                                .song_lodaing {
                                    width: 16px;
                                    height: 16px;
                                }
                            }

                            .progress-btn:hover {
                                border: 1px solid #0aabfa;
                            }
                        }
                    }
                }
            }

            .time_box {
                position: relative;
                height: 80px;
                width: 80px;
                top: 43px;
                float: left;

                .time {
                    user-select: none;
                    float: left;
                    font-size: 12px;
                    color: #999999;
                }
            }

            .play_mod {
                height: 80px;
                width: 41px;
                float: left;
                margin-left: 10px;
                border-left: 1px solid #dcdada57;
                padding-left: 10px;

                .play_mod_list, .play_mod_random, .play_mod_single {
                    cursor: pointer;
                    position: absolute;
                    float: left;
                    background-image: url(../../../resources/images/player.png);
                    background-image: -webkit-image-set(url(../../../resources/images/player.png) 1x, url(../../../resources/images/player@2x.png) 2x);
                    opacity: .8;
                }

                .play_mod_list:hover, .play_mod_random:hover, .play_mod_single:hover {
                    opacity: 1;
                }

                .play_mod_list {
                    top: 30px;
                    width: 26px;
                    height: 25px;
                    background-position: 0 -205px;
                }

                .play_mod_random {
                    top: 30px;
                    width: 25px;
                    height: 19px;
                    background-position: 0 -74px;
                }

                .play_mod_single {
                    top: 30px;
                    width: 26px;
                    height: 25px;
                    background-position: 0 -232px;
                }
            }

            .player_voice {
                position: relative;
                height: 80px;
                width: 41px;
                float: left;
                margin-left: 10px;

                .voice_btn, .voice_btn_no {
                    cursor: pointer;
                    position: absolute;
                    float: left;
                    background-image: url(../../../resources/images/player.png);
                    background-image: -webkit-image-set(url(../../../resources/images/player.png) 1x, url(../../../resources/images/player@2x.png) 2x);
                    opacity: .8;
                }

                .voice_btn:hover, .voice_btn_no:hover {
                    opacity: 1;
                }

                .voice_btn {
                    top: 31px;
                    width: 26px;
                    height: 21px;
                    background-position: 0 -144px;
                }

                .voice_btn_no {
                    top: 31px;
                    width: 26px;
                    height: 21px;
                    background-position: 0 -182px;
                }

                .m_vol {
                    position: absolute;
                    background: #15140d;
                    left: -9px;
                    top: -120px;
                    clear: both;
                    width: 32px;
                    height: 120px;
                    opacity: .6;

                    .voice_progress_bar {
                        position: absolute;
                        height: 100px;
                        width: 100%;
                        float: left;
                        top: 10px;

                        .voice_inner_bar {
                            position: relative;
                            width: 4px;
                            left: 14px;
                            height: 100%;
                            float: left;
                            background: #000000;
                            border-radius: 20px;

                            .voice_progress {
                                position: absolute;
                                bottom: 0;
                                width: 100%;
                                background: #bababa;
                                border-radius: 20px;
                            }

                            .voice_progress-btn-wrapper {
                                width: 18px;
                                height: 18px;
                                position: absolute;
                                left: -7px;
                                bottom: -9px;

                                .voice_progress-btn {
                                    float: left;
                                    cursor: pointer;
                                    position: absolute;
                                    box-sizing: border-box;
                                    top: 1px;
                                    left: 1px;
                                    width: 16px;
                                    height: 16px;
                                    border-radius: 50%;
                                    background: #ffffff;
                                }

                                .voice_progress-btn:hover {
                                    border: 1px solid #0aabfa;
                                }
                            }
                        }
                    }
                }

            }

            .play_list_btn {
                position: relative;
                height: 80px;
                width: 33px;
                float: left;

                .play_list_btn_icon {
                    cursor: pointer;
                    position: absolute;
                    float: left;
                    background-image: url(../../../resources/images/player.png);
                    background-image: -webkit-image-set(url(../../../resources/images/player.png) 1x, url(../../../resources/images/player@2x.png) 2x);
                    opacity: .8;
                }

                .play_list_btn_icon {
                    top: 30px;
                    width: 23px;
                    height: 20px;
                    background-position: 0 -260px;
                }

                .play_list_btn_icon:hover {
                    opacity: 1;
                }
            }

            .show_lyric_btn_box {
                position: relative;
                height: 80px;
                width: 41px;
                float: left;
                display: block;

                .show_lyric_btn {
                    position: absolute;
                    float: left;
                    width: 30px;
                    height: 20px;
                    top: 30px;
                }

                .show_lyric_btn:hover {
                    cursor: pointer;
                }
            }
        }
    }
</style>
