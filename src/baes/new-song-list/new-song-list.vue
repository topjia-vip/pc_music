<template>
    <div class="swiper">
        <swiper :options="swiperOption_song" ref="mySwiper" v-if="newSongs.length>0">
            <swiper-slide v-for="(item, index) in newSongs" :key="index">
                <ul class="songs-box">
                    <li v-for="(song,songIndex) in item"
                        :key="songIndex"
                        class="song-item"
                        :index="index"
                        :songIndex="songIndex"
                    >
                        <div class="song-box">
                            <a class="song-link" :title="song.name">
                                <img class="song-image" :src="song.image" :alt="song.name" :onerror="errorImage">
                                <img class="play" src="../../resources/images/cover_play.png">
                            </a>
                            <div class="song-info">
                                <div class="song-title">
                                    <a class="song-name" :title="song.name+song.subTitle">
                                        {{song.name}}{{song.subTitle}}
                                    </a>
                                </div>
                                <p class="song-singer">
                                    <span class="singer_name"
                                          v-for="(singer,index) in song.singers"
                                          :key="singer.singerId"
                                          :title="singer.singerName"
                                          :singerIndex="index"
                                    >
                                        {{singer.singerName}}
                                    </span>
                                </p>
                            </div>
                            <div class="song-time">{{_handleTime(song.duration)}}</div>
                        </div>
                    </li>
                </ul>
            </swiper-slide>
        </swiper>
        <div class="pagination">
            <div class="swiper-pagination song-pagination" slot="pagination"></div>
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { handleTime } from '../../common/js/util'
import { mapMutations } from 'vuex'
import 'swiper/dist/css/swiper.css'

export default {
  name: 'new-song-list',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    newSongs: {
      type: Array
    }
  },
  data () {
    return {
      swiperOption_song: {
        pagination: {
          el: '.song-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.song-next',
          prevEl: '.song-prev'
        },
        initialSlide: 0,
        simulateTouch: false,
        speed: 1000,
        loop: true
      },
      errorImage: 'this.src="' + require('../../resources/images/img.png') + '"'
    }
  },
  created () {
    setTimeout(() => {
      let songBox = document.getElementsByClassName('song-item')
      for (let i = 0; i < songBox.length; i++) {
        let index = songBox[i].getAttribute('index')
        let songIndex = songBox[i].getAttribute('songIndex')
        // 点击播放歌曲
        songBox[i].children[0].firstChild.addEventListener('click', () => {
          this.selectSong(this.newSongs[index][songIndex])
        })
        // 点击查看歌曲详情
        songBox[i].children[0].children[1].children[0].addEventListener('click', () => {
          this.songDetail(this.newSongs[index][songIndex])
        })
        // 点击查看歌手详情
        let singers = songBox[i].children[0].children[1].children[1].children
        for (let j = 0; j < singers.length; j++) {
          let singerIndex = singers[j].getAttribute('singerIndex')
          singers[j].addEventListener('click', () => {
            this.selectSinger(this.newSongs[index][songIndex].singers[singerIndex])
          })
        }
      }
    }, 2000)
  },
  methods: {
    // 查看歌曲详情
    songDetail (song) {
      this.setCurrentSong(song)
      this.$router.push({
        path: `/songinfo/${song.id}`
      })
    },
    // 处理歌曲播放时长
    _handleTime (duration) {
      return handleTime(duration)
    },
    // 播放选中的歌曲
    selectSong (song) {
      this.$emit('selectSong', song)
    },
    // 查看歌曲的歌手详情
    selectSinger (singer) {
      this.setCurrentSinger(singer)
      this.$router.push({
        path: `/singer_detail/${singer.singerMid}`
      })
    },
    ...mapMutations({
      setCurrentSinger: 'SET_CURRENT_SINGER',
      setCurrentSong: 'SET_CURRENT_SONG'
    })
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  }
}
</script>

<style lang="less">
    .swiper {
        min-width: 900px;
    }

    .songs-box {
        width: 100%;
        height: 100%;
        float: left;

        .song-item {
            list-style: none;
            float: left;
            display: inline-block;
            width: 33.333%;

            .song-box {
                position: relative;
                overflow: hidden;
                border-top: 1px solid #f2f2f2;
                margin: -1px 30px 13px 0;
                padding-top: 12px;
                font-size: 14px;

                .song-link {
                    position: relative;
                    float: left;
                    width: 86px;
                    height: 86px;
                    margin-right: 14px;
                    overflow: hidden;

                    .song-image {
                        display: block;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        -webkit-transform: scale(1) translateZ(0);
                        -webkit-transition: -webkit-transform .75s;
                        transform: scale(1) translateZ(0);
                        transition: transform .75s;
                        object-fit: cover;
                    }

                    .play {
                        position: absolute;
                        height: 70px;
                        width: 70px;
                        left: 50%;
                        top: 50%;
                        margin: -35px;
                        opacity: 0;
                        transform: scale(.4);
                        transition-duration: 500ms;
                        zoom: 1;
                    }

                }

                :hover {
                    .play {
                        opacity: 1;
                        transform: scale(0.6);
                        transition-duration: 500ms;
                    }

                    .song-image {
                        transform: scale(1.05);
                        transition-duration: 500ms;
                    }
                }

                .song-info {
                    .song-title {
                        font-size: 14px;
                        padding: 21px 0 2px;
                        max-width: 50%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        font-weight: 400;

                        .song-name {
                            color: #333;
                            text-decoration: none;
                        }

                        :hover {
                            color: #ff938b;
                        }
                    }

                    .song-singer {
                        max-width: 50%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #999;

                        .singer_name {
                            margin-right: 5px;
                            cursor: pointer;
                            color: #999;
                        }

                        .singer_name:hover {
                            color: #ff938b;
                        }
                    }
                }

                .song-time {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    line-height: 86px;
                    color: #999999;
                }
            }
        }
    }
</style>
