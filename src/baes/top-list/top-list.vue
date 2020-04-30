<template>
    <div class="swiper">
        <swiper :options="swiperOption_topList" ref="mySwiper" v-if="recommendTopList.length>0">
            <swiper-slide v-for="(topList, index) in recommendTopList[0].topList" :key="index">
                <div class="toplist-box">
                    <div class="items-box">
                        <div class="top-box" v-for="(rankSong,index) in topList.rankSong" :key="index">
                            <div class="top-item" :class="`top-item-${index+1}`">
                                <div class="item-box">
                                    <div class="top-title">{{topList.topTitle}}</div>
                                    <svg class="icon" aria-hidden="true">
                                        <use :xlink:href="`#icon-no-${index+1}`"/>
                                    </svg>
                                    <div class="song-detail">
                                        <div class="song-name">{{rankSong.name}}</div>
                                        <div class="singer" v-for="(singer,index) in rankSong.singers"
                                             :key="index">
                                            <a href="" class="singer-name" :title="singer.singerName">{{singer.singerName}}</a>
                                        </div>
                                        <div class="comment-title">热门评论</div>
                                        <div class="comment">
                                            <p class="content" v-html="handleContent(rankSong.comments[0].content,0)">
                                            </p>
                                            <p class="content" v-html="handleContent(rankSong.comments[1].content,1)">
                                            </p>
                                            <p class="content" v-html="handleContent(rankSong.comments[2].content,2)">
                                            </p>
                                            <p class="content" v-html="handleContent(rankSong.comments[3].content,3)">
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg bg-blur" :style="`background-image: url('${rankSong.image}')`"></div>
                                <a href="#">
                                    <img class="play" src="../../resources/images/cover_play.png" title="播放此歌曲">
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </swiper-slide>
        </swiper>
        <div class="pagination">
            <div class="swiper-pagination top-list-pagination" slot="pagination"></div>
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'

import 'swiper/dist/css/swiper.css'

export default {
  name: 'top-list',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    recommendTopList: {
      type: Array
    }
  },
  data () {
    return {
      swiperOption_topList: {
        pagination: {
          el: '.top-list-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.top-list-next',
          prevEl: '.top-list-prev'
        },
        spaceBetween: 50,
        initialSlide: 0,
        simulateTouch: false,
        speed: 1000,
        loop: true
      }
    }
  },
  methods: {
    handleContent (content, index) {
      let res = `${index + 1}、${content.replace(/\\n/gm, '<br/>')}`
      res = `${res.replace(/(\[em\]).*?\[\/em]/g, (item) => {
        return `<img style="width: 14px;height: 14px" src="https://y.gtimg.cn/mediastyle/global/emoji/img/${item.substring(
          4, 11)}.png"/>`
      })}`
      return res
    }
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

        .toplist-box {
            -moz-user-select: none;
            -khtml-user-select: none;
            user-select: none;
            position: relative;
            height: 500px;

            .items-box {
                position: absolute;
                float: left;
                width: 100%;
                left: 0;
                right: 0;
                margin: 0 auto;

                .top-box {
                    list-style: none;
                    display: inline-block;
                    height: 500px;
                    z-index: 2;

                    .top-item {
                        position: absolute;
                        width: 20%;
                        height: 100%;
                        overflow: hidden;

                        .item-box {
                            position: absolute;
                            width: 100%;
                            z-index: 2;

                            .top-title {
                                margin-top: 5px;
                                height: 36px;
                                line-height: 1;
                                font-size: 26px;
                                color: #fff;
                                font-weight: 400;
                                text-align: center;
                                border-bottom: 5px solid #ffffff;
                            }

                            .icon {
                                position: absolute;
                                width: 40px;
                                height: 40px;
                                vertical-align: -0.15em;
                                fill: currentColor;
                                overflow: hidden;
                                left: 0;
                                right: 0;
                                margin: 5px auto;
                            }

                            .song-detail {
                                position: relative;
                                margin-top: 10px;
                                top: 50px;

                                .song-name {
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    height: 36px;
                                    line-height: 1;
                                    font-size: 26px;
                                    color: #fff;
                                    font-weight: 400;
                                    text-align: center;
                                }

                                .singer {
                                    line-height: 1;
                                    font-size: 14px;
                                    font-weight: 400;
                                    text-align: center;

                                    .singer-name {
                                        color: #fff;
                                    }
                                }

                                .comment-title {
                                    margin-top: 20px;
                                    text-align: center;
                                    color: #f0d510;
                                }

                                .comment {
                                    position: relative;
                                    width: 100%;
                                    height: 300px;

                                    .content {
                                        margin-bottom: 5px;
                                        position: relative;
                                        left: 10%;
                                        width: 80%;
                                        color: #fff;
                                        display: -webkit-box; /*  display: -webkit-box; 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示  */
                                        -webkit-box-orient: vertical; /*  -webkit-box-orient 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式  */
                                        -webkit-line-clamp: 3; /*  -webkit-line-clamp用来限制在一个块元素显示的文本的行数 */
                                        overflow: hidden;
                                    }
                                }
                            }
                        }

                        .bg {
                            height: 100%;
                            width: 100%;
                        }

                        .bg-blur {
                            background-repeat: no-repeat;
                            background-position: center;
                            background-size: cover;
                            -webkit-filter: blur(30px);
                            -moz-filter: blur(30px);
                            -o-filter: blur(30px);
                            -ms-filter: blur(30px);
                            filter: blur(30px);
                        }

                        .play {
                            position: absolute;
                            z-index: 2;
                            left: 0;
                            right: 0;
                            margin: 0 auto;
                            top: 50%;
                            opacity: 0;
                            transform: scale(.7);
                            transition-duration: 500ms;
                            zoom: 1;
                        }
                    }

                    :hover {
                        cursor: pointer;

                        .play {
                            opacity: 1;
                            transform: scale(0.99);
                            transition-duration: 500ms;
                        }
                    }

                    .top-item-1 {
                        left: 40%;
                    }

                    .top-item-2 {
                        left: 0;
                        bottom: 0;
                    }

                    .top-item-3 {
                        right: 0;
                        bottom: 0;
                    }
                }
            }
        }
    }
</style>
