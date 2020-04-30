import { playMode } from '../common/js/config'

const state = {
  // 当前选中的排行榜
  currentTop: {
    topId: 4
  },
  // 是否显示回到顶部
  showTopBox: false,
  // 当前的歌手信息(查看歌手详情使用)
  currentSinger: null,
  // 当前选择的歌曲详情的歌曲
  currentSong: null,
  // 搜索关键字
  searchKey: '',
  // 歌单分类id
  categoryGroupId: 10000000,
  // 播放的歌曲列表
  playList: [],
  // 顺序播放列表
  sequenceList: [],
  // 当前播放的歌曲在列表的索引
  currentPlaySongIndex: -1,
  // 播放器是否是全屏的播放器，false显示mini版播放器
  fullScreen: false,
  // 当前的播放状态
  playStatus: false,
  // 当前的播放模式
  mode: playMode.sequence
}

export default state
