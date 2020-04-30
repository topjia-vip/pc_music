<template>
    <div class="swiper">
        <swiper :options="swiperOption_sliber" ref="sliber" v-if="list.length>0">
            <swiper-slide v-for="(item, index) in list" :key="index">
                <a :href="item[0].jumpInfo">
                    <img :src="item[0].picInfo" width="49%" style="margin-right: 1%;float: left">
                </a>
                <a :href="item[1].jumpInfo">
                    <img :src="item[1].picInfo" width="49%" style="margin-left: 1%;float: left">
                </a>
            </swiper-slide>
        </swiper>
        <div class="pagination">
            <div class="swiper-pagination sliber-pagination" slot="pagination"></div>
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

export default {
  name: 'sliber',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    list: {
      type: Array
    }
  },
  data () {
    return {
      swiperOption_sliber: {
        pagination: {
          el: '.sliber-pagination',
          clickable: true
        },
        autoplay: {
          delay: 5000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        navigation: {
          nextEl: '.sliber-next',
          prevEl: '.sliber-prev'
        },
        spaceBetween: 20,
        simulateTouch: false,
        speed: 600,
        loop: true
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.sliber.swiper
    }
  }
}
</script>

<style lang="less">

    .swiper {
        min-width: 900px;
    }

    .pagination {
        position: relative;
        width: 100%;
        height: 40px;

        .swiper-pagination {
            :focus {
                outline: none;
            }

            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin-top: 10px;

            .swiper-pagination-bullet {
                width: 10px;
                height: 10px;
                display: inline-block;
                border-radius: 100%;
                background: #000;
                opacity: 0.2;
                margin: 0 10px;
            }

            .swiper-pagination-bullet-active {
                opacity: 0.5;
            }

            :hover {
                opacity: 0.5;
            }

        }
    }
</style>
