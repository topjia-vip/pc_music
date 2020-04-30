<template>
    <div class="toplist-nav">
        <div class="top-group-box" v-for="(topinfo) in topListInfo" :key="topinfo.groupId">
            <h2 class="top-group-title">{{topinfo.groupName}}</h2>
            <ul class="top-box">
                <li class="top-item"
                    v-for="(top) in topinfo.topList"
                    :key="top.topId"
                    :title="top.topTitle"
                    :class="(top.topId === currentTop.topId)?'top-item-active':''"
                    @click="selectItem(top.topId,topinfo.groupId)"
                >
                    <div class="top-info">
                        <a class="top-link">
                            <img class="top-left-img" :src="top.frontPicUrl" alt="top.topTitle">
                        </a>
                        <p class="top-title">{{top.topTitle}}</p>
                        <p class="top-updateTips">{{top.updateTips}}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'toplist-nav',
  props: {
    topListInfo: {
      type: Array
    }
  },
  computed: {
    ...mapGetters([
      'currentTop'
    ])
  },
  methods: {
    selectItem (topId, groupId) {
      if (this.currentTop.topId === topId) {
        return
      }
      this.topId = topId
      this.$emit('selectTop', topId, groupId)
    }
  }
}
</script>

<style lang="less">
    .toplist-nav {
        user-select: none;
        float: left;
        width: 240px;
        background: #ffffff;
        border-width: 1px;
        border-style: solid;
        border-color: rgba(153, 153, 153, .2);

        .top-group-box {
            line-height: 60px;
            color: #333333;

            .top-group-title {
                padding-left: 17px;
                border-bottom: 1px solid rgba(153, 153, 153, .2);
            }

            .top-box {
                list-style: none;

                .top-item {
                    cursor: pointer;
                    display: block;
                    height: 80px;
                    padding: 10px 0 10px 17px;

                    .top-info {
                        position: relative;

                        .top-link {
                            display: block;
                            position: relative;
                            width: 60px;
                            height: 60px;
                            margin-right: 20px;
                            float: left;

                            .top-left-img {
                                width: 60px;
                                height: 60px;
                            }
                        }

                        .top-title {
                            font-size: 14px;
                            font-weight: 600;
                            height: 20px;
                            line-height: 20px;
                            overflow: hidden;
                            margin-bottom: 20px;
                        }

                        .top-updateTips {
                            color: #999;
                            font-size: 12px;
                            height: 20px;
                            line-height: 20px;
                            overflow: hidden;
                        }
                    }
                }
            }

            .top-item-active {
                background-color: rgba(153, 153, 153, 0.28);
            }

            .top-item:hover {
                background-color: rgba(153, 153, 153, 0.07);
            }

            .top-item-active:hover {
                background-color: rgba(153, 153, 153, 0.28);
            }
        }
    }
</style>
