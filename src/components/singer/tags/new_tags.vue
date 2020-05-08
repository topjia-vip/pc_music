<template>
    <div class="tags_box">
        <!--歌手首字母-->
        <div class="tag tag_index">
            <h2 class="title index_title">首字母</h2>
            <div class="item-box">
                <div class="tag-first-item"
                     :class="tags.index[0].tagId === index?'tag-item-select':''"
                     @click="selectTag(tags.index[0].tagId,'index')"
                >
                    {{tags.index[0].tagName}}
                </div>
                <a class="tag-item tag-index-item"
                   :class="tagIndex.tagId === index?'tag-item-select':''"
                   @click="selectTag(tagIndex.tagId,'index')"
                   v-for="(tagIndex,i) in tags.index" :key="i" v-if="i != 0">{{tagIndex.tagName}}
                </a>
            </div>
        </div>
        <!--歌手地区-->
        <div class="tag tag_area">
            <h2 class="title index_title">地区</h2>
            <div class="item-box">
                <div class="tag-first-item"
                     :class="tags.area[0].tagId === area?'tag-item-select':''"
                     @click="selectTag(tags.area[0].tagId,'area')"
                >
                    {{tags.area[0].tagName}}
                </div>
                <a class="tag-item tag-area-item"
                   :class="tagArea.tagId === area?'tag-item-select':''"
                   @click="selectTag(tagArea.tagId,'area')"
                   v-for="(tagArea,i) in tags.area" :key="i" v-if="i != 0">{{tagArea.tagName}}
                </a>
            </div>
        </div>
        <!--歌手性别-->
        <div class="tag tag_sex">
            <h2 class="title sex_title">性别</h2>
            <div class="item-box">
                <div class="tag-first-item"
                     :class="tags.sex[0].tagId === sex?'tag-item-select':''"
                     @click="selectTag(tags.sex[0].tagId,'sex')"
                >
                    {{tags.sex[0].tagName}}
                </div>
                <a class="tag-item tag-sex-item"
                   :class="tagSex.tagId === sex?'tag-item-select':''"
                   @click="selectTag(tagSex.tagId,'sex')"
                   v-for="(tagSex,i) in tags.sex" :key="i" v-if="i != 0">{{tagSex.tagName}}
                </a>
            </div>
        </div>
        <!--歌手流派-->
        <div class="tag tag_genre">
            <h2 class="title genre_title">流派</h2>
            <div class="item-box">
                <div class="tag-first-item"
                     :class="tags.genre[0].tagId === genre?'tag-item-select':''"
                     @click="selectTag(tags.genre[0].tagId,'genre')"
                >
                    {{tags.genre[0].tagName}}
                </div>
                <a class="tag-item tag-genre-item"
                   :class="tagGenre.tagId === genre?'tag-item-select':''"
                   @click="selectTag(tagGenre.tagId,'genre')"
                   v-for="(tagGenre,i) in tags.genre" :key="i" v-if="i != 0">{{tagGenre.tagName}}
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'new_tags',
  props: {
    tags: {
      type: Object
    },
    index: {
      type: String
    },
    area: {
      type: String
    },
    sex: {
      type: String
    },
    genre: {
      type: String
    }
  },
  methods: {
    selectTag (id, type) {
      this.$emit('selectTag', id, type)
    }
  }
}
</script>

<style lang="less">
    .tags_box {
        user-select: none;
        float: left;
        width: 240px;
        background: #ffffff;
        border-width: 1px;
        border-style: solid;
        border-color: rgba(153, 153, 153, .2);

        .tag {
            float: left;
        }

        .tag-item {
            text-align: center;
            color: #333333;
            overflow: hidden;
            float: left;
            line-height: 26px;
            margin: 0 12px 6px 0

        }

        .tag-first-item {
            cursor: pointer;
            text-align: center;
            color: #333333;
            width: 50px;
            height: 26px;
            overflow: hidden;
            padding: 0 8px;
            line-height: 26px;
            margin: 0 12px 6px 0
        }

        .tag-item-select {
            background-color: #ff938b;
            color: #fff;
        }

        .title {
            line-height: 60px;
            padding-left: 17px;
            border-bottom: 1px solid rgba(153, 153, 153, .2);
        }

        .item-box {
            margin-top: 10px;
            padding-left: 17px;
        }

        .tag_index {
            color: #333333;

            .tag-index-item {
                width: 23px;
                height: 26px;
            }
        }

        .tag_area {
            color: #333333;

            .tag-area-item {
                text-align: center;
                width: 50px;
                height: 26px;
            }
        }

        .tag_sex {
            color: #333333;

            .sex_title {
                width: 240px;
            }

            .tag-sex-item {
                text-align: center;
                width: 50px;
                height: 26px;
            }
        }

        .tag_genre {
            color: #333333;

            .tag-genre-item {
                text-align: center;
                width: 50px;
                height: 26px;
            }
        }
    }
</style>
