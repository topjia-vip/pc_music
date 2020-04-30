<template>
    <div class="swiper">
        <swiper :options="swiperOption_disst" ref="mySwiper" v-if="recommendDisstList.length>0">
            <swiper-slide v-for="(item, index) in recommendDisstList" :key="index">
                <div class="disst_box" style="width: 18%;margin-right: 1%;margin-left: 1%"
                     :index="index"
                     :disstIndex="disstIndex"
                     v-for="(disst,disstIndex) in item"
                     :key="disstIndex"
                     ref="box"
                >
                    <div class="disst_logo" ref="logo" title="播放">
                        <img style="width: 100%;height:100%;display: block" class="images"
                             :src="disst.disstLogo"
                             :alt="disst.disstName"
                             :onerror="errorImage"
                        >
                        <img class="play" src="../../resources/images/cover_play.png">
                    </div>
                    <h4 class="disst_title">
                        <span>
                            <a :title="disst.disstName">{{disst.disstName}}</a>
                        </span>
                    </h4>
                    <div class="disst_playNum">播放量：{{handleVisitNum(disst.visitnum)}}</div>
                </div>
            </swiper-slide>
        </swiper>
        <div class="pagination">
            <div class="swiper-pagination disst-pagination" slot="pagination"></div>
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'

import 'swiper/dist/css/swiper.css'

export default {
  name: 'disst-list',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    recommendDisstList: {
      type: Array
    }
  },
  mounted () {
    setTimeout(() => {
      let disstBox = document.getElementsByClassName('disst_box')
      for (let i = 0; i < disstBox.length; i++) {
        let index = disstBox[i].getAttribute('index')
        let disstIndex = disstBox[i].getAttribute('disstIndex')
        disstBox[i].children[0].addEventListener('click', () => {
          this.playSongList(index, disstIndex)
        })
        disstBox[i].children[1].addEventListener('click', () => {
          this.disstDetail(index, disstIndex)
        })
      }
    }, 2000)
  },
  data () {
    return {
      swiperOption_disst: {
        pagination: {
          el: '.disst-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.disst-next',
          prevEl: '.disst-prev'
        },
        initialSlide: 0,
        simulateTouch: false,
        speed: 1000,
        loop: true
      },
      errorImage: 'this.src="' + require('../../resources/images/img.png') + '"'
    }
  },
  methods: {
    playSongList (index, disstIndex) {
      this.$emit('playSongList', index, disstIndex)
    },
    disstDetail (index, disstIndex) {
      this.$emit('disstDetail', index, disstIndex)
    },
    handleVisitNum (number) {
      if (number >= 10000) {
        const num = number / 10000
        return `${Math.round(num * 10) / 10}万`
      } else {
        return number
      }
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
        min-width: 900px;
    }

    .disst_box {
        float: left;
        overflow: hidden;

        .disst_logo {
            cursor: pointer;
            position: relative;
            overflow: hidden;
            margin-bottom: 15px;

            .images {
                transform: scale(1);
                transition-duration: 500ms;
            }

            .play {
                position: absolute;
                height: 70px;
                width: 70px;
                left: 50%;
                top: 50%;
                margin: -35px;
                opacity: 0;
                transform: scale(.7);
                transition-duration: 500ms;
                zoom: 1;
            }

        }

        :hover {
            .play {
                opacity: 1;
                transform: scale(0.99);
                transition-duration: 500ms;
            }

            .images {
                transform: scale(1.05);
                transition-duration: 500ms;
            }
        }

        .disst_title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            a {
                color: #000;
            }

            :hover {
                color: #ff938b;
            }
        }

        .disst_playNum {
            color: #999;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 22px;
        }
    }
</style>
