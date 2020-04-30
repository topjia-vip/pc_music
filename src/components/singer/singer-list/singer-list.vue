<template>
    <div class="singer-list" v-if="singerList">
        <div class="singer-list-hot" v-if="(index==='-100'&& curPage === 1)">
            <ul class="singer-list-hot-ul">
                <li class="singer-list-hot-item" v-for="(hotSinger,index) in hotSingerList"
                    :key="index" @click="selectSinger(hotSinger)">
                    <div class="singer-list-hot-item-box">
                        <a class="singer-list-hot-item-link" :title="hotSinger.singerName">
                            <img class="img"
                                 :src="hotSinger.singerPic"
                                 :alt="hotSinger.singerName"
                                 onerror="this.src='https://y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=2592000'"
                            >
                        </a>
                        <h3 class="hot-singer-name">
                            <a class="hot-singer-name-link" :title="hotSinger.singerName">{{hotSinger.singerName}}</a>
                        </h3>
                    </div>
                </li>
            </ul>
        </div>
        <ul class="singer-list-ul">
            <li class="singer-list-item" v-for="(singer,index) in singerList"
                :key="index"
                @click="selectSinger(singer)"
            >
                <a class="singer-list-item-link" :title="singer.singerName">{{singer.singerName}}</a>
            </li>
        </ul>
        <div class="pageHelper">
            <Page :total="total" :page-size="80" @on-change="changePage"/>
        </div>
    </div>
</template>
<script>
import { Page } from 'view-design'
import { mapMutations } from 'vuex'

export default {
  name: 'singer-list',
  components: {
    Page
  },
  props: {
    singerList: {
      type: Array
    },
    hotSingerList: {
      type: Array
    },
    index: {
      type: String
    },
    total: {
      type: Number
    }
  },
  data () {
    return {
      curPage: 1
    }
  },
  methods: {
    changePage (page) {
      this.curPage = page
      this.$emit('changePage', page)
    },
    selectSinger (singer) {
      this.setCurrentSinger(singer)
      this.$router.push({
        path: `/singer_detail/${singer.singerMid}`
      })
    },
    ...mapMutations({
      setCurrentSinger: 'SET_CURRENT_SINGER'
    })
  }
}
</script>

<style lang="less">
    .singer-list {
        .singer-list-hot {
            overflow: hidden;
            text-align: center;

            .singer-list-hot-ul {
                margin-right: -20px;
                overflow: hidden;
                zoom: 1;
                margin-bottom: 4px;

                .singer-list-hot-item {
                    float: left;
                    width: 20%;
                    margin-bottom: 20px;
                    overflow: hidden;

                    .singer-list-hot-item-box {
                        position: relative;
                        min-height: 195px;
                        padding: 25px 0;
                        overflow: hidden;

                        .singer-list-hot-item-link {
                            margin-left: auto;
                            margin-right: auto;

                            .img {
                                width: 140px;
                                height: 140px;
                                border-radius: 50%;
                            }
                        }

                        .hot-singer-name {
                            font-size: 16px;
                            font-weight: 400;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            zoom: 1;
                            margin: 20px 30px 4px;

                            .hot-singer-name-link {
                                color: #333333;
                            }

                            .hot-singer-name-link:hover {
                                color: #ff938b;
                            }
                        }
                    }
                }
            }
        }

        .singer-list-ul {
            margin-right: -20px;
            overflow: hidden;
            margin-bottom: 60px;

            .singer-list-item {
                padding-left: 8%;
                float: left;
                width: 20%;
                list-style: none;

                .singer-list-item-link {
                    float: left;
                    max-width: 90%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 14px;
                    line-height: 36px;
                    color: #333333;
                }

                .singer-list-item-link:hover {
                    color: #ff938b;
                }
            }
        }

        .pageHelper {
            position: relative;
            text-align: center;

            .ivu-page {
                .ivu-page-prev {
                    width: 50px;
                    height: 50px;
                    line-height: 50px;
                    font-weight: 600;
                }

                .ivu-page-next {
                    width: 50px;
                    height: 50px;
                    line-height: 50px;
                    font-weight: 600;
                }

                .ivu-page-item {
                    display: inline-block;
                    vertical-align: middle;
                    min-width: 32px;
                    width: 50px;
                    height: 50px;
                    line-height: 50px;
                    margin-right: 4px;
                    text-align: center;
                    list-style: none;
                    background-color: #fff;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    cursor: pointer;
                    font-family: Arial;
                    font-weight: 500;
                    border: 1px solid #dcdee2;
                    border-radius: 4px;
                    transition: border .2s ease-in-out, color .2s ease-in-out;
                }

                .ivu-page-item:hover {
                    border-color: #2d8cf0;
                }

                .ivu-page-item-active {
                    border-color: #2d8cf0;
                }
            }
        }
    }
</style>
