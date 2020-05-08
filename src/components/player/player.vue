<template>
    <div class="player-box">
        <mini-player
                ref="miniPlayer"
                :currentTime="currentTime"
                :voicePercent="voicePercent"
                :canPlay="canPlay"
                :percent='percent'
                :currentSongLoad="currentSongLoad"
                :showPlayList="showPlayList"
                :playingLyric="playingLyric"
                :lock="lock"
                :showLyric="showLyric"
                @perv='perv'
                @changePlayStatus="changePlayStatus"
                @next="next(false)"
                @openNormalPlayer="openNormalPlayer"
                @changeMode="changeMode"
                @onProgressBarMove="onProgressBarMove"
                @triggerPercent="_triggerPercent"
                @triggerVoicePercent="_triggerVoicePercent"
                @openPlayList="openPlayList"
                @changeLock="changeLock"
                @changeShowLyric="changeShowLyric"
        />
        <mini-play-list class="mini-player-list"
                        ref="miniPlayList"
                        :current-lyric="currentLyric"
                        :currentLyricTrans="currentLyricTrans"
                        :current-line-num="currentLineNum"
                        @clearAll="clearAll"
                        @deleteSong="_deleteSong"
                        @selectItem="selectItem"
        />
        <audio ref="audio"
               @timeupdate="updateTime"
               @ended="end"
               @canplay="canPlaySong"
        />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Lyric from 'lyric-parser'
import { getSongPurl } from '../../api/song'
import { ERR_OK } from '../../api/config'
import { Message } from 'view-design'
import { playMode } from '../../common/js/config'
import { shuffle, handleTime } from '../../common/js/util'
import scroll from '../../baes/scroll/scroll'

import MiniPlayList from '../../baes/mini-play-list/mini-play-list'
import MiniPlayer from './mini-player/mini-player'

export default {
  name: 'player',
  components: {
    MiniPlayer,
    MiniPlayList,
    Message,
    scroll
  },
  computed: {
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
  created () {
    document.addEventListener('mousedown', e => {
      const x = document.getElementsByClassName('mini-player')[0]
      const z = document.getElementsByClassName('mini-player-list')[0]
      const y = document.getElementsByClassName('ivu-modal-wrap')[0]
      if (x || z || y) {
        if (!x.contains(event.target) && !z.contains(event.target) && !y.contains(event.target)) {
          this.showPlayList = false
        }
      }
    })
  },
  data () {
    return {
      percent: 0,
      voicePercent: 0,
      currentTime: 0,
      showBtn: false,
      showPlayList: false,
      currentLyric: null,
      currentLyricTrans: null,
      playingLyric: '',
      currentLineNum: 0,
      currentSongLoad: 0,
      playReady: false,
      lyricReady: false,
      canPlay: false,
      isMove: false,
      lock: true,
      showLyric: true,
      checkSongPlayAndLyric: false
    }
  },
  mounted () {
    this.voicePercent = 0.5
    // 全局监听键盘事件，实现使用键盘控制歌曲
    this.addKeyEvent()
  },
  methods: {
    addKeyEvent () {
      // 全局监听键盘事件，实现使用键盘控制歌曲
      document.onkeydown = (e) => {
        let key = e.keyCode
        // 空格暂停/播放歌曲
        if (key === 32) {
          e.preventDefault()
          this.changePlayStatus()
        }
        // 下一首歌曲[alt+→]
        if (e.altKey && key === 39) {
          e.preventDefault()
          this.next(false)
        }
        // 上一首歌曲[alt+←]
        if (e.altKey && key === 37) {
          e.preventDefault()
          this.prev()
        }
        // 切换播放模式[O]
        if (key === 79) {
          e.preventDefault()
          this.changeMode()
        }
        // 打开关闭播放列表
        if (key === 80) {
          e.preventDefault()
          this.openPlayList()
        }
        // 锁定播放器
        if (key === 76) {
          e.preventDefault()
          this.changeLock()
        }
        // 显示/隐藏歌词
        if (key === 77) {
          e.preventDefault()
          this.changeShowLyric()
        }
      }
    },
    openPlayList () {
      this.showPlayList = !this.showPlayList
    },
    changeLock () {
      this.lock = !this.lock
    },
    changeShowLyric () {
      this.showLyric = !this.showLyric
    },
    playSong () {
      this.checkSongPlayAndLyric = true
      this.canPlay = true
      this.setPlayStatus(true)
      this.currentLyric.play()
    },
    canPlaySong () {
      if (this.lyricReady) {
        this.lyricReady = false
        this.playSong()
      } else {
        this.playReady = true
      }
    },
    // 获取歌曲歌词
    getLyric () {
      if (this.sequenceList.length === 0) {
        return
      }
      this.currentPlaySong.getLyric().then((data) => {
        if (this.currentPlaySong.lyric !== data.lyric) {
          return
        }
        this.currentLyric = new Lyric(data.lyric, this.handleLyric)
        if (data.trans) {
          this.currentLyricTrans = new Lyric(data.trans)
        }
        if (this.playReady) {
          this.playReady = false
          this.playSong()
        } else {
          this.lyricReady = true
        }
      }).catch(() => {
        this.currentLyric = null
        this.currentLineNum = 0
      })
    },
    handleLyric ({ lineNum, txt }) {
      this.currentLineNum = lineNum
      let num = 5
      if (this.currentLyricTrans) {
        num = 2
      }
      if (lineNum > num) {
        let lineEl = this.$refs.miniPlayList.$refs.lyricLine[lineNum - num]
        this.$refs.miniPlayList.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.miniPlayList.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    // 清空播放列表
    clearAll () {
      if (this.sequenceList.length === 0) {
        return
      }
      this.deleteSongList()
      this.currentLyric.stop()
      this.currentLyric = null
      this.currentTime = 0
      this.currentLineNum = 0
      this.currentSongLoad = 0
    },
    // 删除歌曲
    _deleteSong (song) {
      if (song.id === this.currentPlaySong.id) {
        this.currentLyric.stop()
        this.currentLyric = null
        this.currentTime = 0
        this.currentLineNum = 0
        this.currentSongLoad = 0
      }
      this.deleteSong(song)
    },
    _handleTime (time) {
      return handleTime(time)
    },
    changeTitle () {
      if (this.playStatus) {
        let title = '悦音乐丨▶ '
        if (this.currentPlaySong.title) {
          title += this.currentPlaySong.title
        } else {
          title += this.currentPlaySong.name
        }
        if (this.currentPlaySong.subTitle) {
          title += this.currentPlaySong.subTitle
        }
        document.title = title
      } else {
        document.title = '悦音乐'
      }
    },
    // 从播放列表中切换歌曲
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentPlaySongIndex(index)
    },
    // 切换播放模式
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentPlaySong.id
      })
      this.setCurrentPlaySongIndex(index)
    },
    // 歌曲播放结束切换下一首
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next(false)
      }
      this.changeTitle()
    },
    // 单曲循环
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayStatus(true)
      this.changeTitle()
    },
    // 切换到上一首歌曲
    perv () {
      if (this.sequenceList.length === 0 || !this.canPlay) {
        return
      }
      if (this.playList.length === 1 || this.mode === playMode.loop) {
        this.loop()
      } else {
        let index = this.currentPlaySongIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentPlaySongIndex(index)
        if (!this.playList) {
          this.changePlayStatus()
        }
      }
      this.changeTitle()
    },
    // 切换到下一首歌曲
    next (type) {
      if (!type && (this.sequenceList.length === 0 || !this.canPlay)) {
        return
      }
      if (this.playList.length === 1 || this.mode === playMode.loop) {
        this.loop()
      } else {
        let index = this.currentPlaySongIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentPlaySongIndex(index)
        if (!this.playList) {
          this.changePlayStatus()
        }
      }
      this.changeTitle()
    },
    // 更新播放时间
    updateTime (e) {
      if (!this.isMove) {
        this.currentTime = e.target.currentTime
        // 校准歌词播放进度与歌曲播放进度
        if (this.checkSongPlayAndLyric) {
          setTimeout(() => {
            this.currentLyric.seek(this.currentTime * 1000)
          }, 10)
        }
        this.checkSongPlayAndLyric = false
        if (this.currentSongLoad !== 100) {
          const audio = this.$refs.audio
          const timeRanges = audio.buffered
          if (audio.buffered.length !== 0) {
            this.currentSongLoad = parseInt(timeRanges.end(timeRanges.length - 1) * 100 / audio.duration * 100) / 100
          }
        }
      }
    },
    // 改变播放状态
    changePlayStatus () {
      if (this.sequenceList.length === 0 || !this.canPlay) {
        return
      }
      this.setPlayStatus(!this.playStatus)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    closeNormalPlayer () {
      this.$refs.normalPlayer.$el.style.zIndex = -100
      this.setFullScreen(false)
    },
    openNormalPlayer () {
      this.showPlayList = false
      this.$refs.normalPlayer.$el.style.zIndex = 101
      this.setFullScreen(true)
    },
    // 歌曲进度条操作
    _triggerPercent (percent) {
      this.isMove = false
      this.percent = percent
      const currentTime = this.currentPlaySong.duration * this.percent
      this.$refs.audio.currentTime = currentTime
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
      if (!this.playStatus) {
        this.changePlayStatus()
      }
    },
    // 进度条滑动时歌词跟随滑动
    onProgressBarMove (percent) {
      this.isMove = true
      this.percent = percent
      const currentTime = this.currentPlaySong.duration * this.percent
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
      this.currentTime = currentTime
    },
    // 音量大小操作
    _triggerVoicePercent (voicePercent) {
      this.voicePercent = voicePercent
      this.$refs.audio.volume = this.voicePercent
    },
    cleanAudio () {
      const audio = this.$refs.audio
      this.setPlayStatus(false)
      audio.pause()
    },
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ]),
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayStatus: 'SET_PLAYING_STATUS',
      setCurrentPlaySong: 'SET_CURRENT_PLAY_SONG',
      setCurrentPlaySongIndex: 'SET_CURRENT_PLAY_SONG_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST'
    })
  },
  watch: {
    currentTime (newCurrentTime) {
      this.percent = newCurrentTime / this.currentPlaySong.duration
    },
    currentPlaySong (newSong, oldSong) {
      if (!newSong.id) {
        this.currentTime = 0
        this.$refs.audio.src = ''
        this.percent = 0
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentLyric = null
        this.currentLyricTrans = null
        this.currentLineNum = 0
        this.playingLyric = ''
      }
      this.cleanAudio()
      setTimeout(() => {
        this.percent = 0
        this.canPlay = false
        this.currentSongLoad = 0
      }, 20)
      clearTimeout(this.Timeout)
      this.Timeout = setTimeout(() => {
        if (!newSong.playUrl) {
          //  获取新的播放链接（防止老链接死亡无法播放）
          getSongPurl(newSong.mid).then(res => {
            if (res.code === ERR_OK) {
              if (res.songPlayUrl !== '') {
                //  重新设置该歌曲的播放链接
                this.getLyric()
                this.setCurrentPlaySong(res.songPlayUrl)
                this.$refs.audio.src = this.currentPlaySong.playUrl
                this.$refs.audio.volume = this.voicePercent
                this.changeTitle()
              } else {
                // 提示用户无法播放并跳过播放下一首
                Message.info({
                  content: `${newSong.name}因版权原因无法播放`,
                  duration: 2
                })
                this.next(true)
              }
            }
          })
        } else {
          if (newSong.playUrl !== '') {
            this.getLyric()
            this.$refs.audio.src = this.currentPlaySong.playUrl
            this.$refs.audio.volume = this.voicePercent
            this.changeTitle()
          } else {
            // 提示用户无法播放并跳过播放下一首
            Message.info({
              content: `${newSong.name}因版权原因无法播放`,
              duration: 2
            })
            this.next(true)
          }
        }
      }, 500)
    },
    // 根据播放状态修改音乐的播放状态
    playStatus (newPlayStatus) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlayStatus ? audio.play() : audio.pause()
        this.changeTitle()
      })
    },
    showPlayList (newShowPlayList) {
      if (newShowPlayList) {
        this.$refs.miniPlayList.$el.style.zIndex = 100
        this.$refs.miniPlayList.$el.style.opacity = 1
      } else {
        this.$refs.miniPlayList.$el.style.zIndex = -100
        this.$refs.miniPlayList.$el.style.opacity = 0
      }
    }
  }
}
</script>

<style lang="less">
</style>
