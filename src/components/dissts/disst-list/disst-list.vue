<template>
    <div>
        <div class="disst_list" v-show="isShow" v-if="disstList.dissts && disstList.dissts.length>0">
            <div class="distt_sort">
                <div class="recommend_disst_box">
                    <a class="recommend_disst" :class="sortId === 5?'active':''" @click="selectSort(5)">推荐</a>
                </div>
                <div class="new_disst_box">
                    <a class="new_disst" :class="sortId === 2?'active':''" @click="selectSort(2)">最新</a>
                </div>
            </div>
            <div class="disst_list_box">
                <ul class="disst_list_ul">
                    <li class="disst_list_item" v-for="(disst,index) in curDisstList" :key="index">
                        <div class="item_box">
                            <div class="disst_link" :title="disst.disstName" @click="selectItem(disst,index)">
                                <img v-lazy="disst.disstLogo" :alt="disst.disstName" class="disst_img"
                                     :onerror="errorImage">
                                <img class="play" src="../../../resources/images/cover_play.png">
                            </div>
                        </div>
                        <h4 class="disst_title" @click="selectDisstDetail(disst)">
                            <span class="disst_title_txt">
                                <a :title="disst.disstName">{{disst.disstName}}</a>
                            </span>
                        </h4>
                        <div class="disst_author">
                            <a :title="disst.nickname">{{disst.nickname}}</a>
                        </div>
                        <div class="disst_playNum">播放量：{{handleVisitNum(disst.visitnum)}}</div>
                    </li>
                </ul>
                <div class="pageHelper">
                    <Page :current="curPage"
                          :total="disstList.total"
                          :page-size="12" show-elevator
                          @on-change="changePage"/>
                </div>
            </div>
        </div>
        <div class="loading-box" v-show="!isShow"></div>
        <svg class="loading_logo" v-show="!isShow" xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink"
             width="480px"
             height="60px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50" xml:space="preserve">
    <rect x="0" y="7.6416" width="4" height="14.7168" fill="#FF6700" opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s"
                 repeatCount="indefinite"></animate>
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s"
                 repeatCount="indefinite"></animate>
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s"
                 repeatCount="indefinite"></animate>
    </rect>
            <rect x="8" y="5.1416" width="4" height="19.7168" fill="#FF6700" opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s"
                 repeatCount="indefinite"></animate>
                <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s"
                         repeatCount="indefinite"></animate>
                <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s"
                         repeatCount="indefinite"></animate>
    </rect>
            <rect x="16" y="7.3584" width="4" height="15.2832" fill="#FF6700" opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s"
                 repeatCount="indefinite"></animate>
                <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s"
                         repeatCount="indefinite"></animate>
                <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s"
                         repeatCount="indefinite"></animate>
    </rect>
</svg>
    </div>
</template>

<script>
import { Page } from 'view-design'
import { dissList, disstDetailSongList } from '../../../api/disst'
import { ERR_OK } from '../../../api/config'
import { _normalizeSongs } from '../../../common/js/util'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'disst-list',
  components: {
    Page
  },
  created () {
    this._disstList()
  },
  data () {
    return {
      disstList: {},
      curDisstList: [],
      pageData: [],
      curPage: 1,
      isShow: false,
      sortId: 5,
      errorImage: 'this.src="' + require('../../../resources/images/img.png') + '"'
    }
  },
  computed: {
    ...mapGetters([
      'categoryGroupId'
    ])
  },
  methods: {
    selectDisstDetail (disst) {
      this.$router.push({
        path: `/disst_detail/${disst.disstId}`
      })
    },
    selectItem (disst, index) {
      if (!disst.songlist) {
        this.isShow = false
        disstDetailSongList(disst.disstId).then(res => {
          if (res.code === ERR_OK) {
            this.disstList.dissts[index].songlist = _normalizeSongs(res.songs)
          }
          this.playDisstSong(this.disstList.dissts[index].songlist)
          this.isShow = true
        })
      } else {
        this.playDisstSong(this.disstList.dissts[index].songlist)
      }
    },
    selectSort (sortId) {
      this.sortId = sortId
    },
    handleVisitNum (number) {
      if (number >= 10000) {
        const num = number / 10000
        return `${Math.round(num * 10) / 10}万`
      } else {
        return number
      }
    },
    _disstList () {
      this.isShow = false
      dissList(this.categoryGroupId, this.sortId).then(res => {
        if (res.code === ERR_OK) {
          this.disstList = res.data
          this.handlePage(this.disstList)
          this.isShow = true
        }
      })
    },
    handlePage (disstList) {
      const dissts = this.disstList.dissts
      const conunt = Math.ceil(dissts.length / 12)
      for (let i = 0; i < conunt; i++) {
        this.pageData[i] = dissts.slice(i * 12, i * 12 + 12)
      }
      this.curDisstList = this.pageData[0]
    },
    changePage (curPage) {
      this.$emit('toTop')
      this.curPage = curPage
      this.curDisstList = this.pageData[curPage - 1]
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
    categoryGroupId () {
      this.curPage = 1
      this._disstList()
    },
    sortId () {
      this.curPage = 1
      this._disstList()
    }
  }
}
</script>

<style lang="less">
    .disst_list {
        margin-left: 268px;
        margin-top: 20px;
        min-width: 900px;
        height: 1150px;

        .distt_sort {

            .recommend_disst_box {
                float: left;
                width: 60px;
                height: 30px;
                line-height: 30px;
                text-align: center;

                .recommend_disst {
                    font-size: 18px;
                }
            }

            .new_disst_box {
                width: 120px;
                height: 30px;
                line-height: 30px;
                text-align: center;

                .new_disst {
                    font-size: 18px;
                }
            }

            .new_disst:hover, .recommend_disst:hover {
                color: #ff938b;
            }

            .active {
                color: #ff938b;
            }

            a {
                display: inline-block;
                height: 20px;
                line-height: 20px;
                color: #999;
                border-bottom: 2px solid #fff;
                font-size: 14px;
                padding: 0 2px;
                letter-spacing: 3px;
            }
        }

        .disst_list_box {
            margin-top: 20px;

            .disst_list_ul {
                .disst_list_item {
                    display: inline-block;
                    width: 25%;
                    padding-bottom: 44px;
                    overflow: hidden;
                    font-size: 14px;
                    vertical-align: top;

                    .item_box {
                        position: relative;
                        margin-right: 20px;

                        .disst_link {
                            cursor: pointer;
                            position: relative;
                            display: block;
                            overflow: hidden;
                            margin-bottom: 15px;

                            .disst_img {
                                width: 100%;
                                height: 100%;
                                display: block;
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

                            .disst_img {
                                transform: scale(1.05);
                                transition-duration: 500ms;
                            }
                        }
                    }

                    .disst_title {
                        overflow: hidden;

                        .disst_title_txt {
                            float: left;
                            max-width: 100%;
                            font-weight: 400;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            line-height: 22px;
                            max-height: 44px;
                        }

                        a {
                            color: #000;
                        }

                        a:hover {
                            color: #ff938b;
                        }
                    }

                    .disst_author {
                        a {
                            color: #999;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            height: 22px;
                        }

                        a:hover {
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
            }
        }

        .pageHelper {
            position: relative;
            text-align: center;
            margin: 20px 0;
        }
    }

    .loading-box {
        height: 1150px;
        margin-left: 268px;
        margin-top: 20px;
        min-width: 900px;
    }

    .loading_logo {
        position: fixed;
        top: 50%;
        left: 50%;
    }
</style>
