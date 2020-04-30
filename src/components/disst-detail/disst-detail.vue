<template>
    <Content class="disst_detail">
        <div class="disst_detail_box" v-show="isShow">
            <div class="disst_detail_content">
                <div class="disst_detail_head">
                    <span class="disst_detail_img">
                        <img class="photo" :src="disst.disstLogo" :alt="disst.disstName">
                    </span>
                    <div class="disst_detail_cont">
                        <div class="disst_detail_name">
                            <h1 class="disst_detail_name_txt" v-html="disst.disstName"/>
                        </div>
                        <div class="disst_detail_nike" :title="disst.nickname">
                            <i class="nike_icon"/>
                            <span class="nike_name">{{disst.nickname}}</span>
                        </div>
                    </div>
                    <div class="disst_detail_info">
                        <div class="info_item disst_detail_tag_box">
                            标签：
                            <span class="disst_detail_tag" @click="selectTag(tag.id)" :title="tag.name"
                                  v-for="(tag) in disst.tags" :key="tag.id">{{tag.name}}</span>
                        </div>
                        <div class="info_item">播放量：{{handleVisitNum(disst.visitnum)}}</div>
                    </div>
                    <div class="disst_detail_actions">
                        <div class="mod-btn play-all-btn" @click="playAllSong">
                            <i class="play_all_icon"/>
                            播放全部
                        </div>
                    </div>
                    <div class="disst_detail_desc">
                        <div class="disst_desc_box">
                            <span class="desc_title">简介：</span>
                            <div class="desc_txt">
                                <span v-html="disst.desc"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="disst_detail_layout">
                    <div class="disst_detail_songlist">
                        <ul class="disst_detail_songlist_head">
                            <li class="disst_detail_songlist_head_name">歌曲</li>
                            <li class="disst_detail_songlist_head_author">歌手</li>
                            <li class="disst_detail_songlist_head_album">专辑</li>
                            <li class="disst_detail_songlist_head_time">时长</li>
                        </ul>
                        <ul class="disst_detail_songlist_list">
                            <li v-for="(song,index) in disst.songlist" :key="index"
                                :style="(index+1) % 2 === 0?'background: rgba(153, 153, 153, 0.07)':''"
                                @click="addSong(song)"
                            >
                                <div class="songlist_item">
                                    <div class="item_number">{{index+1}}</div>
                                    <div class="item_songname">
                                        <div class="item_image">
                                            <img class="image" :src="song.image" alt="song.name">
                                        </div>
                                        <span class="item_songname_txt" :title="song.name">
                                            <a @click.stop="songDetail(song)">{{song.name}}</a>
                                        </span>
                                    </div>
                                    <div class="item_singer">
                                        <span class="singer_name"
                                              v-for="(singer) in song.singers"
                                              :key="singer.singerId"
                                              :title="singer.singerName"
                                              @click.stop="selectSinger(singer)"
                                        >
                                         {{singer.singerName}}
                                        </span>
                                    </div>
                                    <div class="item_album">
                                        <span class="album_name" :title="song.album">{{song.album}}</span>
                                    </div>
                                    <div class="item_time">{{_handleTime(song.duration)}}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <m-footer v-show="isShow"/>
        <loading v-show="!isShow"/>
    </Content>
</template>

<script>
import ViewUI, { Content } from 'view-design'
import { disstDetail } from '../../api/disst'
import Loading from '../../baes/loading/loading'
import { _normalizeSongs, handleTime } from '../../common/js/util'
import MFooter from '../../baes/footer/m-footer'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'disst-detail',
  components: {
    MFooter,
    Loading,
    Content
  },
  data () {
    return {
      isShow: false,
      disst: {},
      disstId: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.disstId = to.params.disstId
    })
  },
  created () {
    this._initDisstDetail(this.$route.params.disstId)
  },
  methods: {
    // 查看歌曲详情
    songDetail (song) {
      this.setCurrentSong(song)
      this.$router.push({
        path: `/songinfo/${song.id}`
      })
    },
    selectSinger (singer) {
      this.setCurrentSinger(singer)
      this.$router.push({
        path: `/singer_detail/${singer.singerMid}`
      })
    },
    selectTag (id) {
      this.setCategoryGroupId(id)
      this.$router.push({
        path: `/dissts/${id}`
      })
    },
    playAllSong () {
      this.selectPlay(
        {
          list: this.disst.songlist,
          index: 0
        }
      )
    },
    addSong (song) {
      this.insertSong(song)
    },
    _handleTime (duration) {
      return handleTime(duration)
    },
    _initDisstDetail (id) {
      ViewUI.LoadingBar.start()
      this.isShow = false
      disstDetail(id).then(res => {
        this.disst = res.disst
        this.disst.songlist = _normalizeSongs(res.disst.songlist)
        this.isShow = true
        ViewUI.LoadingBar.finish()
      })
    },
    handleVisitNum (number) {
      if (number >= 10000) {
        const num = number / 10000
        return `${Math.round(num * 10) / 10}万`
      } else {
        return number
      }
    },
    ...mapMutations({
      setCategoryGroupId: 'SET_CATEGORY_GROUP_ID',
      setCurrentSinger: 'SET_CURRENT_SINGER',
      setCurrentSong: 'SET_CURRENT_SONG'
    }),
    ...mapActions([
      'selectPlay',
      'insertSong'
    ])
  },
  watch: {
    disstId (newDisstId) {
      this._initDisstDetail(newDisstId)
    }
  }
}
</script>

<style lang="less">
    .disst_detail {
        position: relative;
        height: 100%;
        min-width: 900px;
        background: linear-gradient(#f4f4f4, #fff);

        .disst_detail_box {
            position: relative;
            margin: 0 50px;

            .nike_icon {
                background-image: url(../../resources/images/icon_sprite.png);
                background-image: -webkit-image-set(url(../../resources/images/icon_sprite.png) 1x, url(../../resources/images/icon_sprite@2x.png) 2x);
            }

            .disst_detail_content {
                max-width: 1200px;
                min-width: 900px;
                min-height: 700px;
                margin-left: auto;
                margin-right: auto;
                position: relative;

                .disst_detail_head {
                    position: relative;
                    height: 250px;
                    padding-left: 305px;
                    margin-top: 40px;
                    margin-bottom: 35px;

                    .disst_detail_img {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 250px;
                        height: 250px;

                        .photo {
                            display: block;
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }

                    .disst_detail_cont {
                        padding-top: 13px;

                        .disst_detail_name {
                            overflow: hidden;
                            height: 50px;
                            line-height: 50px;

                            .disst_detail_name_txt {
                                float: left;
                                font-size: 31px;
                                line-height: 50px;
                                font-weight: 400;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                max-width: 70%;
                                margin-right: 10px;
                                color: #000000;
                                cursor: default;
                            }
                        }

                        .disst_detail_nike {
                            height: 24px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            max-width: 90%;

                            .nike_icon {
                                float: left;
                                width: 16px;
                                height: 16px;
                                background-position: -20px -240px;
                                margin: 4px 7px 0 0;
                            }

                            .nike_name {
                                font-size: 16px;
                                color: #333;
                                cursor: pointer;
                            }

                            .nike_name:hover {
                                color: #ff938b;
                            }
                        }
                    }

                    .disst_detail_info {
                        width: 520px;
                        padding-top: 8px;

                        .info_item {
                            color: #000000;
                            height: 27px;
                            line-height: 27px;
                            width: 400px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            font-size: 14px;
                        }

                        .disst_detail_tag_box {
                            cursor: default;

                            .disst_detail_tag {
                                cursor: pointer;
                                margin-right: 12px;
                            }

                            .disst_detail_tag:hover {
                                color: #ff938b;
                            }
                        }
                    }

                    .disst_detail_actions {
                        position: absolute;
                        bottom: 0;
                        font-size: 0;

                        .mod-btn {
                            border-radius: 2px;
                            font-size: 14px;
                            margin-right: 6px;
                            padding: 0 23px;
                            height: 38px;
                            line-height: 38px;
                            display: inline-block;
                            white-space: nowrap;
                            box-sizing: border-box;
                            overflow: hidden;

                            .play_all_icon {
                                width: 13px;
                                height: 16px;
                                background-position: -80px -220px;
                                vertical-align: -3px;
                                display: inline-block;
                                margin-right: 6px;
                                background-image: url(../../resources/images/icon_sprite.png);
                                background-image: -webkit-image-set(url(../../resources/images/icon_sprite.png) 1x, url(../../resources/images/icon_sprite@2x.png) 2x);
                                background-repeat: no-repeat;
                            }

                        }

                        .play-all-btn {
                            user-select: none;
                            cursor: pointer;
                            background-color: #2d90f4;
                            color: #ffffff;
                        }

                        .play-all-btn:hover {
                            background: #0a84c3;
                            color: #ffffff;
                        }
                    }

                    .disst_detail_desc {
                        width: 100%;
                        color: #000000;

                        .desc_title {
                            float: left;
                            height: 30px;
                            line-height: 30px;
                        }

                        .desc_txt {
                            float: left;
                            height: 30px;
                            line-height: 30px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            max-width: 90%;
                        }
                    }
                }

                .disst_detail_layout {

                    .disst_detail_songlist {
                        width: 100%;
                        padding-bottom: 20px;

                        .disst_detail_songlist_head {
                            position: relative;
                            padding-left: 46px;
                            padding-right: 95px;
                            height: 50px;
                            line-height: 50px;
                            color: #999;
                            list-style: none;
                            background-color: rgba(0, 0, 0, 0.01);

                            .disst_detail_songlist_head_name {
                                float: left;
                                width: 54%;
                                position: relative;
                                white-space: normal;
                                padding-left: 60px;
                            }

                            .disst_detail_songlist_head_author, .disst_detail_songlist_head_album {
                                float: left;
                                padding-left: 15px;
                                width: 20%;
                                box-sizing: border-box;
                            }

                            .disst_detail_songlist_head_time {
                                position: absolute;
                                top: 0;
                                right: 38px;
                                width: 50px;
                            }

                            @media (max-width: 1240px) {
                                .disst_detail_songlist_head_name {
                                    width: 72%;
                                }

                                .disst_detail_songlist_head_author, .disst_detail_songlist_head_album {
                                    width: 14%;
                                }
                            }
                        }

                        .disst_detail_songlist_list {
                            list-style: none;
                            overflow: hidden;
                            clear: both;

                            .songlist_item {
                                position: relative;
                                padding-left: 46px;
                                padding-right: 95px;
                                clear: both;
                                font-size: 0;
                                overflow: hidden;

                                .item_number {
                                    float: left;
                                    position: absolute;
                                    color: #999;
                                    width: 36px;
                                    line-height: 80px;
                                    height: 80px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    font-size: 14px;
                                }

                                .item_songname {
                                    float: left;
                                    width: 54%;
                                    position: relative;
                                    white-space: normal;
                                    line-height: 80px;
                                    height: 80px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    padding-left: 60px;

                                    .item_image {
                                        float: left;
                                        height: 80px;
                                        width: 80px;

                                        .image {
                                            width: 60px;
                                            height: 60px;
                                            margin-right: 10px;
                                            margin-top: 10px;
                                        }
                                    }

                                    .item_songname_txt {
                                        max-width: 85%;
                                        box-sizing: border-box;
                                        float: left;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        margin-right: 8px;
                                        white-space: nowrap;
                                        font-size: 14px;

                                        a {
                                            color: #000;
                                            text-decoration: none;
                                        }

                                        a:hover {
                                            color: #ff938b;
                                        }
                                    }
                                }

                                .item_singer {
                                    float: left;
                                    padding-left: 15px;
                                    width: 20%;
                                    box-sizing: border-box;
                                    line-height: 80px;
                                    height: 80px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    font-size: 14px;

                                    .singer_name {
                                        cursor: pointer;
                                        color: #000000;
                                    }

                                    .singer_name:hover {
                                        color: #ff938b;
                                    }
                                }

                                .item_album {
                                    float: left;
                                    padding-left: 15px;
                                    width: 20%;
                                    box-sizing: border-box;
                                    line-height: 80px;
                                    height: 80px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    font-size: 14px;

                                    .album_name {
                                        cursor: pointer;
                                        color: #000000;
                                    }
                                }

                                .item_time {
                                    position: absolute;
                                    top: 0;
                                    right: 38px;
                                    width: 50px;
                                    line-height: 80px;
                                    height: 80px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    font-size: 14px;
                                    color: #999;
                                }

                                @media (max-width: 1240px) {
                                    .item_songname {
                                        width: 72%;
                                    }

                                    .item_singer {
                                        width: 14%;
                                    }

                                    .item_album {
                                        width: 14%;
                                    }
                                }
                            }

                            .songlist_item:hover {
                                cursor: pointer;
                                background: #e7e7e7;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
