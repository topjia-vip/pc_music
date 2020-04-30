<template>
    <Content class="recommendDisstList" ref="recommendDisstList">
        <div>
            <div class="recommendDisstList-content">
                <h1 class="recommendDisstList-title">
                    歌单推荐
                </h1>
                <div class="recommendDisstCategory">
                    <a class="recommendDisstCategory-item">为你推荐</a>
                    <a class="all-disst" title="更多歌单" @click="toDissts">更多</a>
                </div>
                <disst-list :recommendDisstList="recommendDisstList" @playSongList="playDisst"
                            @disstDetail="disstDetail"/>
            </div>
            <swiper-btn :className="swiper_btn_ClassName"/>
        </div>
    </Content>
</template>

<script>
import { Content } from 'view-design'
import DisstList from '../../../baes/disst-list/disst-list'
import SwiperBtn from '../../../baes/swiper-btn/swiper-btn'
import { disstDetailSongList } from '../../../api/disst'
import { ERR_OK } from '../../../api/config'
import { mapActions } from 'vuex'
import { _normalizeSongs } from '../../../common/js/util'

export default {
  name: 'recommendDisstList',
  props: {
    recommendDisstList: {
      type: Array
    }
  },
  data () {
    return {
      swiper_btn_ClassName: 'disst'
    }
  },
  components: {
    SwiperBtn,
    DisstList,
    Content
  },
  methods: {
    toDissts () {
      this.$router.push('/dissts')
    },
    playDisst (index, disstIndex) {
      const temp = this.recommendDisstList[index][disstIndex]
      if (!temp.songlist) {
        disstDetailSongList(temp.disstId).then(res => {
          if (res.code === ERR_OK) {
            this.recommendDisstList[index][disstIndex].songlist = _normalizeSongs(res.songs)
          }
          this.playDisstSong(this.recommendDisstList[index][disstIndex].songlist)
        })
      } else {
        this.playDisstSong(this.recommendDisstList[index][disstIndex].songlist)
      }
    },
    disstDetail (index, disstIndex) {
      const temp = this.recommendDisstList[index][disstIndex]
      this.$router.push({
        path: `/disst_detail/${temp.disstId}`
      })
    },
    playDisstSong (list) {
      this.selectPlay(
        {
          list: list,
          index: 0
        }
      )
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  watch: {
    '$router' (to, from) {
      console.log(to)
      console.log(from)
    }
  }
}
</script>

<style lang="less">
    .recommendDisstList {
        position: relative;
        background: linear-gradient(#f4f4f4, #fff);

        .recommendDisstList-content {
            max-width: 1200px;
            min-width: 900px;
            margin-left: auto;
            margin-right: auto;
            position: relative;

            .recommendDisstList-title {
                text-align: center;
                padding: 40px 0 20px 0;
                color: #333333;
            }

            .recommendDisstCategory {
                position: relative;
                height: 50px;
                z-index: 2;
                text-align: center;

                .recommendDisstCategory-item {
                    cursor: default;
                    display: inline-block;
                    font-size: 15px;
                    margin: 0 24px;
                    color: #ff938b;
                }

                .all-disst {
                    position: absolute;
                    right: 0;
                    margin-right: 1%;
                    color: #333;
                }

                :hover {
                    color: #ff938b;
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
