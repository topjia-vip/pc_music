<template>
    <Footer class="layout-footer-center">
        <div class="footer">
            <p>数据均来源于<a href="https://y.qq.com/" target="_blank" title="QQ音乐" style="color: green">QQ音乐</a>,请支持正版</p>
            <p>网页模拟QQ音乐，仅供学习参考</p>
        </div>
    </Footer>
</template>

<script>
import { Footer } from 'view-design'

export default {
  name: 'm-footer',
  components: {
    Footer
  }
}
</script>

<style lang="less">
    .layout-footer-center {
        height: 200px;
        min-width: 900px;

        .footer {
            color: #999999;
            text-align: center;
        }
    }
</style>
