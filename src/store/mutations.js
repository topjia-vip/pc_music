import * as types from './mutation-types'

const mutations = {
  [types.SET_CURRENT_TOP] (state, top) {
    state.currentTop = top
  },
  [types.SET_PLAY_LIST] (state, songList) {
    state.playList = songList
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_CURRENT_PLAY_SONG] (state, songPlayUrl) {
    state.playList[state.currentPlaySongIndex].playUrl = songPlayUrl
  },
  [types.SET_CURRENT_PLAY_SONG_INDEX] (state, index) {
    state.currentPlaySongIndex = index
  },
  [types.SET_PLAYING_STATUS] (state, flag) {
    state.playStatus = flag
  },
  [types.SET_CATEGORY_GROUP_ID] (state, id) {
    state.categoryGroupId = id
  },
  [types.SET_CURRENT_SINGER] (state, singer) {
    state.currentSinger = singer
  },
  [types.SET_CURRENT_SONG] (state, song) {
    state.currentSong = song
  },
  [types.SET_SEARCH_KEY] (state, searchKey) {
    state.searchKey = searchKey
  },
  [types.SET_SHOW_TOP_BOX] (state, showTopBox) {
    state.showTopBox = showTopBox
  }
}
export default mutations
