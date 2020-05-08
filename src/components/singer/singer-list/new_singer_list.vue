<template>
    <div class="singer-list">
        <!--热门歌手显示-->
        <div class="hot-singer-content" v-show="showHot">
            <div class="hot-singer-title">
                <h2>分类热门歌手</h2>
            </div>
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
        <!--显示非热门歌手-->
        <ul class="singer-list-ul" v-show="showSingerList">
            <li class="singer-list-item" v-for="(singer,index) in singerList"
                :key="index"
                @click="selectSinger(singer)"
            >
                <a class="singer-list-item-link" :title="singer.singerName">{{singer.singerName}}</a>
            </li>
        </ul>
        <!--分页器-->
        <div class="pageHelper">
            <Page :current="curPage" :total="total" :page-size="80" @on-change="changePage"/>
        </div>
        <!--没有歌手显示-->
        <div class="not-singer" v-show="!showHot && !showSingerList">
            <h2>Sorry,该分类下暂无歌手</h2>
        </div>
    </div>
</template>

<script>
import { Page } from 'view-design'
import { mapMutations } from 'vuex'

export default {
  name: 'new_singer_list',
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
    },
    showHot: {
      type: Boolean
    },
    showSingerList: {
      type: Boolean
    },
    curPage: {
      type: Number
    }
  },
  methods: {
    changePage (page) {
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
        margin-left: 268px;
        margin-top: 20px;
        min-width: 900px;
        min-height: 850px;

        .hot-singer-title {
            border-bottom: 1px solid #999999;
            user-select: none;
            color: #333333;
        }

        .singer-list-hot-ul {
            background: #9999991c;
            overflow: hidden;
            zoom: 1;
            margin: 6px 0 6px 0;
            border-radius: 8px;

            .singer-list-hot-item {
                float: left;
                width: 20%;
                overflow: hidden;

                .singer-list-hot-item-box {
                    position: relative;
                    min-height: 195px;
                    padding: 25px 0 15px 0;
                    overflow: hidden;

                    .singer-list-hot-item-link {
                        margin-left: auto;
                        margin-right: auto;

                        .img {
                            width: 140px;
                            height: 140px;
                            border-radius: 20px;
                            margin-left: 13%;
                        }
                    }

                    .hot-singer-name {
                        text-align: center;
                        line-height: 30px;
                        font-size: 16px;
                        font-weight: 400;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        zoom: 1;

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

        .singer-list-ul {
            border-top: 1px dashed #999999;
            overflow: hidden;
            margin-bottom: 20px;

            .singer-list-item {
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
            margin: 20px 0;
        }

        .not-singer {
            color: #333333;
            width: 100%;
            text-align: center;
            position: absolute;
            margin-top: 25%;
        }
    }
</style>
