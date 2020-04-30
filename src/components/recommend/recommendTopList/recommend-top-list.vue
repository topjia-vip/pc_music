<template>
    <Content class="recommendTopList" v-if="topList.length>0">
        <div>
            <div class="recommendTopList-content">
                <div class="recommendTopList-title">
                    <h1>{{topList[0].groupName}}</h1>
                    <a class="more-top" title="更多排行榜">更多</a>
                </div>
                <top-list :recommend-top-list="topList"/>
            </div>
            <swiper-btn :class-name="swiper_btn_ClassName"/>
        </div>
    </Content>
</template>

<script>
import { Content } from 'view-design'

import './font-icon/iconfont.js'
import TopList from '../../../baes/top-list/top-list'
import SwiperBtn from '../../../baes/swiper-btn/swiper-btn'

export default {
  name: 'recommend-top-list',
  components: {
    SwiperBtn,
    TopList,
    Content
  },
  props: {
    topList: {
      type: Array
    }
  },
  data () {
    return {
      swiper_btn_ClassName: 'top-list'
    }
  }
}
</script>

<style lang="less">
    .recommendTopList {
        position: relative;
        background: linear-gradient(#f4f4f4, #fff);

        .recommendTopList-content {
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            position: relative;

            .recommendTopList-title {
                text-align: center;
                padding-top: 40px;

            }

            .more-top {
                position: absolute;
                right: 0;
                top: 50px;
                z-index: 2;
                color: #333;
            }

            .more-top:hover {
                color: #ff938b;
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
