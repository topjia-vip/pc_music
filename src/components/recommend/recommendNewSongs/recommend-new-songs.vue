<template>
    <Content class="recommendNewSongList" ref="recommendNewSongList">
        <div>
            <div class="recommendNewSongList-content">
                <h1 class="recommendNewSongList-title">新歌首发</h1>
                <div class="recommendNewSongListCategory">
                    <div class="mod-btn play-all-btn" @click="playAllNewSong">
                        <i class="play_all_icon"/>
                        播放全部
                    </div>
                    <a class="recommendNewSongListCategory-item">最新歌曲</a>
                </div>
                <new-song-list :newSongs="handleSongs" @selectSong="addSongToPlayList"/>
            </div>
            <swiper-btn :class-name="swiper_btn_ClassName"/>
        </div>
    </Content>
</template>

<script>
import { Content } from 'view-design'
import NewSongList from '../../../baes/new-song-list/new-song-list'
import SwiperBtn from '../../../baes/swiper-btn/swiper-btn'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'recommend-new-songs',
  components: {
    SwiperBtn,
    NewSongList,
    Content
  },
  props: {
    newSongs: {
      type: Array
    },
    handleSongs: {
      type: Array
    }
  },
  data () {
    return {
      swiper_btn_ClassName: 'song'
    }
  },
  methods: {
    playAllNewSong () {
      this.selectPlay(
        {
          list: this.newSongs,
          index: 0
        }
      )
    },
    addSongToPlayList (song) {
      this.insertSong(song)
    },
    ...mapActions([
      'selectPlay',
      'insertSong'
    ]),
    ...mapMutations({
      setCurrentSinger: 'SET_CURRENT_SINGER'
    })
  }
}
</script>

<style lang="less">
    .recommendNewSongList {
        position: relative;
        background: linear-gradient(#f4f4f4, #fff);

        .recommendNewSongList-content {
            max-width: 1200px;
            min-width: 900px;
            margin-left: auto;
            margin-right: auto;
            position: relative;

            .recommendNewSongList-title {
                text-align: center;
                padding: 40px 0 20px 0;
                color: #333333;
            }

            .recommendNewSongListCategory {
                position: relative;
                height: 50px;
                text-align: center;
                z-index: 2;
                line-height: 50px;

                .mod-btn {
                    position: absolute;
                    top: 0;
                    left: 0;
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

                .recommendNewSongListCategory-item {
                    cursor: default;
                    color: #ff938b;
                    display: inline-block;
                    font-size: 15px;
                    margin: 0 24px;
                }
            }
        }

        :hover {
            .mod_slide_action {
                .swiper-button {
                    opacity: 1;
                    transform: translateX(0);
                    transition-property: opacity, transform, background, width;
                    transition-duration: .5s;
                }
            }
        }
    }
</style>
