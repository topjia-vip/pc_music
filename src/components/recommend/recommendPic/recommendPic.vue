<template>
    <Content class="recommendPic">
        <div>
            <div class="recommendPic-content">
                <!--轮播图-->
                <h1 class="recommendPic-sliber-title">精彩推荐</h1>
                <sliber :list="recommendFocus"/>
            </div>
            <swiper-btn :class-name="swiper_btn_ClassName"/>
        </div>
    </Content>
</template>

<script>
import { Content } from 'view-design'
import Sliber from '../../../baes/sliber/sliber'
import SwiperBtn from '../../../baes/swiper-btn/swiper-btn'

export default {
  name: 'recommendPic',
  components: {
    SwiperBtn,
    Sliber,
    Content
  },
  props: {
    recommendFocus: {
      type: Array
    }
  },
  data () {
    return {
      swiper_btn_ClassName: 'sliber'
    }
  }
}
</script>

<style lang="less">
    .recommendPic {
        background: linear-gradient(#f4f4f4, #fff);
        position: relative;

        .recommendPic-content {
            max-width: 1200px;
            min-width: 900px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            height: 100%;

            .recommendPic-sliber-title {
                text-align: center;
                padding: 40px 0 20px 0;
                color: #333333;
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
