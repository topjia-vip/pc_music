<template>
    <div class="search-box">
        <div class="search_input">
            <input ref="searchInput"
                   :value="key"
                   @input="changeInput($event)"
                   @focus="foucus"
                   @blur="blur"
                   @keypress.enter.prevent="search"
                   class="search"
                   placeholder="搜索歌曲、歌手"
            />
            <button class="search_btn" @click="search">
                <i class="search_icon"/>
            </button>
        </div>
        <div class="search_res_box" v-if="!smartSearchResNull" v-show="isShowSearchBox && key!=='' && !searching">
            <div class="search_result" v-if="smartSearch">
                <div class="search_result_song" v-show="smartSearch.songs.length>0">
                    <h4 class="search_result_title">
                        <i class="search_result__icon_song"/>
                        单曲
                    </h4>
                    <ul class="search_result_list">
                        <li v-for="(song) in smartSearch.songs" :key="song.id" @click="selectSong(song)">
                            <div class="search_result_link" v-html="handleName(song,'song')">
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="search_result_singer" v-show="smartSearch.singers.length>0">
                    <h4 class="search_result_title">
                        <i class="search_result__icon_singer"/>
                        歌手
                    </h4>
                    <ul class="search_result_list">
                        <li v-for="(singer,index) in smartSearch.singers" :key="index"
                            @click="selectSinger(singer)">
                            <div class="search_result_link" v-html="handleName(singer,'singer')">
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { smartSearch } from '../../../api/search'
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'mini-search-box',
  data () {
    return {
      key: '',
      smartSearch: null,
      isShowSearchBox: false,
      searching: false,
      smartSearchResNull: true
    }
  },
  created () {
    document.addEventListener('mouseup', e => {
      const x = document.getElementsByClassName('search-box')[0]
      if (x) {
        if (!x.contains(event.target)) {
          this.isShowSearchBox = false
        }
      }
    })
  },
  computed: {
    ...mapGetters([
      'searchKey'
    ])
  },
  methods: {
    search () {
      if (!this.key) {
        return
      }
      if (this.searchKey !== this.key) {
        this.setSearchKey(this.key)
      }
      this.searching = true
      this.$refs.searchInput.blur()
      this.isShowSearchBox = false
      this.$router.push({
        path: `/search`
      }).catch(err => {
        return err
      })
    },
    // 点击迷你搜索框的歌曲 跳转到该歌曲详情页
    selectSong (song) {
      this.key = song.name
      this.isShowSearchBox = false
      this.setCurrentSong(song)
      this.setSearchKey(this.key)
      this.$router.push({
        path: `/songinfo/${song.id}`
      })
    },
    // 点击歌手跳转歌手详情页
    selectSinger (singer) {
      this.key = singer.singerName
      this.isShowSearchBox = false
      this.setCurrentSinger(singer)
      this.setSearchKey(this.key)
      this.$router.push({
        path: `/singer_detail/${singer.singerMid}`
      })
    },
    handleName (item, type) {
      if (type === 'song') {
        const index = item.name.indexOf(this.key)
        if (index !== -1) {
          // 包含关键字 关键字高亮
          const subName1 = item.name.substring(0, index)
          const subName2 = item.name.substring(index + this.key.length)
          return `<span class="search_result_name">
                    <span>${subName1}</span>
                    <span class="search_result_name_keyword">${this.key}</span>
                    <span>${subName2}</span>
                  </span>
                  -
                  <span class="search_result_singer_name">
                     ${item.singers[0].singerName}
                  </span>`
        } else {
          // 不包含关键字
          return `<span class="search_result_name" style="font-size: 14px">
                     ${item.name}
                  </span>
                  -
                  <span class="search_result_singer_name" style="font-size: 14px">
                     ${item.singers[0].singerName}
                  </span>`
        }
      } else {
        const index = item.singerName.indexOf(this.key)
        if (index !== -1) {
          // 包含关键字 关键字高亮
          const subName1 = item.singerName.substring(0, index)
          const subName2 = item.singerName.substring(index + this.key.length)
          return `<span class="search_result_singer_name">
                    <span>${subName1}</span>
                    <span class="search_result_name_keyword">${this.key}</span>
                    <span>${subName2}</span>
                  </span>`
        } else {
          // 不包含关键字
          return `<span class="search_result_singer_name" style="font-size: 14px">${item.singerName}</span>`
        }
      }
    },
    changeInput (e) {
      this.key = e.target.value
      if (this.key === '') {
        this.smartSearch = null
        this.isShowSearchBox = false
      } else {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this._smartSearch()
        }, 200)
      }
    },
    _smartSearch (type = 1) {
      if (this.key === '') {
        this.isShowSearchBox = false
        this.smartSearch = null
        return
      }
      smartSearch(this.key).then(res => {
        this.smartSearch = res.data
        if (this.smartSearch && this.smartSearch.singers.length === 0 && this.smartSearch.songs.length === 0) {
          this.isShowSearchBox = false
          this.smartSearchResNull = true
        } else {
          this.smartSearchResNull = false
          if (type === 1) {
            this.isShowSearchBox = true
          }
        }
      })
    },
    foucus () {
      document.onkeydown = (e) => {}
      this.isShowSearchBox = true
      this.searching = false
    },
    blur () {
      this.$emit('searchBlur')
    },
    ...mapMutations({
      setCurrentSinger: 'SET_CURRENT_SINGER',
      setCurrentSong: 'SET_CURRENT_SONG',
      setSearchKey: 'SET_SEARCH_KEY'
    })
  },
  watch: {
    searchKey (newKey) {
      if (newKey === this.key) {
        return
      }
      this.key = this.searchKey
      this._smartSearch(0)
      this.isShowSearchBox = false
    }
  }
}
</script>

<style lang="less">
    .search-box {
        position: absolute;
        top: 0;
        right: 20px;

        .search_input {
            border: 1px solid #c9c9c9;
            padding: 0 33px 0 11px;
            line-height: 36px;
            height: 36px;
            margin-top: 26px;
            position: relative;
            border-radius: 3px;
            background-color: #fff;
            -webkit-transition: width .6s ease-out;
            transition: width .6s ease-out;

            .search {
                width: 174px;
                height: 36px;
                border: 0 none;
                font-size: 14px;
                background: 0 0;
                -webkit-transition: width .6s ease-out, visibility .6s 1ms ease-out;
                transition: width .6s ease-out, visibility .6s 1ms ease-out;
            }

            .search:focus {
                outline: none;
            }

            .search_btn {
                position: absolute;
                top: 0;
                right: 0;
                border: 0 none;
                width: 38px;
                height: 35px;
                overflow: visible;
                background: 0 0;

                .search_icon {
                    background-image: url(../../../resources/images/icon_sprite.png);
                    background-image: -webkit-image-set(url(../../../resources/images/icon_sprite.png) 1x, url(../../../resources/images/icon_sprite@2x.png) 2x);
                    position: absolute;
                    top: 50%;
                    right: 11px;
                    margin-top: -8px;
                    width: 16px;
                    height: 16px;
                    background-position: 0 -40px;
                }
            }

            .search_btn:focus {
                outline: none;
            }

            .search_btn:hover {
                cursor: pointer;

                .search_icon {
                    background-position: 0 -60px;
                }
            }
        }

        .search_res_box {
            position: absolute;
            top: 61px;
            left: 0;
            background: #FFF;
            width: 220px;
            border: 1px solid #c9c9c9;
            z-index: 9;
            text-align: left;
            font-size: 14px;
            overflow: hidden;

            .search_result {
                max-height: 800px;
                visibility: visible;
                overflow: hidden;

                i {
                    position: absolute;
                    left: 15px;
                    width: 16px;
                    height: 16px;
                    overflow: hidden;
                    background-image: url(../../../resources/images/icon_sprite.png);
                    background-image: -webkit-image-set(url(../../../resources/images/icon_sprite.png) 1x, url(../../../resources/images/icon_sprite@2x.png) 2x);
                    background-repeat: no-repeat;
                }

                .search_result_song {
                    padding: 5px 0;
                    border-top: solid 1px #f2f2f2;
                    margin-top: -1px;

                    .search_result_title {
                        padding: 0 11px 0 41px;
                        line-height: 36px;
                        color: #999;

                        .search_result__icon_song {
                            top: 16px;
                            background-position: -20px -220px;
                        }
                    }

                    .search_result_list {
                        list-style: none;

                        .search_result_link {
                            display: block;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            padding: 0 11px 0 41px;
                            line-height: 36px;
                            color: #999;

                            .search_result_name {
                                color: #333;
                                font-size: 0;

                                span {
                                    font-size: 14px;
                                }

                                .search_result_name_keyword {
                                    color: #ff938b;
                                }
                            }
                        }

                        .search_result_link:hover {
                            span {
                                color: #f8f8f8;
                            }

                            .search_result_name_keyword {
                                color: #f8f8f8;
                            }

                            color: #f8f8f8;
                            cursor: pointer;
                            background: #ff938b;
                        }

                    }
                }

                .search_result_singer {
                    position: relative;
                    padding: 5px 0;
                    border-top: solid 1px #f2f2f2;
                    margin-top: -1px;

                    .search_result_title {
                        padding: 0 11px 0 41px;
                        line-height: 36px;
                        color: #999;

                        .search_result__icon_singer {
                            top: 16px;
                            background-position: -20px -240px;
                        }
                    }

                    .search_result_list {
                        list-style: none;

                        .search_result_link {
                            display: block;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            padding: 0 11px 0 41px;
                            line-height: 36px;
                            color: #999;

                            .search_result_singer_name {
                                color: #333;
                                font-size: 0;

                                span {
                                    font-size: 14px;
                                }

                                .search_result_name_keyword {
                                    color: #ff938b;
                                }
                            }
                        }

                        .search_result_link:hover {
                            cursor: pointer;

                            span {
                                color: #f8f8f8;
                            }

                            .search_result_name_keyword {
                                color: #f8f8f8;
                            }

                            color: #f8f8f8;
                            background: #ff938b;
                        }
                    }

                }
            }
        }
    }
</style>
