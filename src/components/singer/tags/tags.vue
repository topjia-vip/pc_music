<template>
    <div class="singer-tags" v-if="tags">
        <div class="singer-tags-list">
            <a class="tag-item" :class="tagIndex.tagId === index?'tag-item-select':''"
               v-for="(tagIndex,i) in tags.index" :key="i"
               @click="selectTag(tagIndex.tagId,'index')"
            >{{tagIndex.tagName}}</a>
        </div>
        <div class="singer-tags-list">
            <a class="tag-item" :class="tagArea.tagId === area?'tag-item-select':''"
               v-for="(tagArea,index) in tags.area" :key="index"
               @click="selectTag(tagArea.tagId,'area')"
            >{{tagArea.tagName}}</a>
        </div>
        <div class="singer-tags-list">
            <a class="tag-item" :class="tagSex.tagId === sex?'tag-item-select':''"
               v-for="(tagSex,index) in tags.sex" :key="index"
               @click="selectTag(tagSex.tagId,'sex')"
            >{{tagSex.tagName}}</a>
        </div>
        <div class="singer-tags-list">
            <a class="tag-item" :class="tagGenre.tagId === genre?'tag-item-select':''"
               v-for="(tagGenre,index) in tags.genre" :key="index"
               @click="selectTag(tagGenre.tagId,'genre')"
            >{{tagGenre.tagName}}</a>
        </div>
    </div>
</template>

<script>
export default {
  name: 'tags',
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
    .singer-tags {
        padding: 34px 0 17px 40px;
        margin: 30px 0 20px;

        .singer-tags-list {
            padding-bottom: 3px;
            height: auto;
            zoom: 1;
            clear: both;
            overflow: hidden;

            .tag-item {
                color: #333333;
                height: 26px;
                overflow: hidden;
                float: left;
                padding: 0 8px;
                line-height: 26px;
                margin: 0 12px 14px 0
            }

            .tag-item:hover {
                color: #ff938b;
            }

            .tag-item-select {
                background-color: #ff938b;
                color: #fff;
            }

            .tag-item-select:hover {
                background-color: #ff938b;
                color: #fff;
            }
        }
    }
</style>
