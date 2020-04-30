<template>
    <div class="categoryGroups">
        <div class="songlist-tag">
            <div class="disst_link_box"
                 :class="categoryGroupId === 10000000?'tag_active':''"
                 @click="selectTag(10000000)"
            >
                <a class="disst_link all_dissts">全部</a>
            </div>
            <dl v-for="(categoryGroup,index) in categoryGroups" :key="index" v-if="index !== 0">
                <dt>{{categoryGroup.categoryGroupName}}</dt>
                <dd v-for="(tag) in categoryGroup.categories"
                    :key="tag.categoryId"
                    :class="categoryGroupId === tag.categoryId?'tag_active':''"
                    @click="selectTag(tag.categoryId)"
                >
                    <a class="disst_link tag_item" v-html="tag.categoryName"/>
                </dd>
            </dl>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dissts-tag-nav',
  props: {
    categoryGroups: {
      type: Array
    }
  },
  computed: {
    ...mapGetters([
      'categoryGroupId'
    ])
  },
  methods: {
    selectTag (id) {
      if (this.categoryGroupId === id) {
        return
      }
      this.$emit('selectCategoryGroup', id)
    }
  }
}
</script>

<style lang="less">
    .categoryGroups {
        user-select: none;
        float: left;
        width: 240px;
        border-right: 2px solid rgba(153, 153, 153, .2);

        .songlist-tag {
            margin: 0 20px 0 10px;

            .disst_link_box {
                display: inline-block;
                height: 24px;
                line-height: 24px;
                font-size: 16px;

                .disst_link {
                    color: #000;
                }

                .disst_link:hover {
                    color: #ff938b;
                }
            }

            .tag_active {
                background: #ff938b;

                .disst_link {
                    color: #ffffff;
                }
            }

            dl {
                float: left;
                margin-top: 26px;
                font-size: 0;

                dt {
                    color: #999;
                    font-size: 16px;
                    height: 15px;
                    line-height: 15px;
                }

                dd {
                    float: left;
                    height: 30px;
                    margin-top: 12px;
                    margin-right: 5px;

                    .tag_item {
                        color: #000;
                        line-height: 30px;
                        font-size: 14px;
                    }

                    .tag_item:hover {
                        color: #ff938b;
                    }
                }
            }

            .disst_link {
                padding: 0 6px;
            }

            .tag_active:hover {
                background: #ff938b;

                .disst_link {
                    color: #ffffff;
                }
            }
        }
    }

</style>
