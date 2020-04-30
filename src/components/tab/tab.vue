<template>
    <div class="tab">
        <router-link tag="div" class="tab-item" to="/recommend">
            <span class="tab-link">推荐</span>
        </router-link>
        <router-link tag="div" class="tab-item" to="/singer">
            <span class="tab-link">歌手</span>
        </router-link>
        <router-link tag="div" class="tab-item" to="/rank">
            <span class="tab-link">排行榜</span>
        </router-link>
        <router-link tag="div" class="tab-item" to="/dissts">
            <span class="tab-link">分类歌单</span>
        </router-link>
    </div>
</template>

<script>
export default {
  name: 'tab'
}
</script>

<style scoped lang="less">
    .tab {
        position: relative;
        left: 20px;
        height: 100%;
        float: left;

        .tab-item {
            float: left;
            height: 100%;
            width: 100px;

            .tab-link {
                user-select: none;
                font-size: 18px;
                display: block;
                height: 100%;
                text-align: center;
                line-height: 90px;
            }

            :hover {
                cursor: pointer;
                color: #ff938b;
            }

            &.router-link-active {
                background-color: #ff938b;
                color: #fff;
            }

            &.router-link-active :hover {
                background-color: #ff938b;
                color: #fff;
            }
        }
    }
</style>
