<template>
    <div class="mod_slide_action">
        <div class=" slide_action prev">
            <div class="swiper-button swiper-button-prev " :class="className+'-prev'" slot="button-prev"
            >
                <span class="iconfont icon-prev"/>
            </div>
        </div>
        <div class=" slide_action next">
            <div class="swiper-button swiper-button-next" :class="className+'-next'" slot="button-next"
            >
                <span class="iconfont icon-next"/>
            </div>
        </div>
    </div>
</template>

<script>
import './font_icon/iconfont.css'

export default {
  name: 'swiper-btn',
  props: {
    className: {
      type: String
    }
  }
}
</script>

<style lang="less">
    .mod_slide_action {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .slide_action {
            position: absolute;
            top: 0;
            width: 50%;
            height: 100%;

            .swiper-button {
                position: absolute;
                top: 50%;
                margin-top: -54px;
                width: 79px;
                height: 108px;
                background: rgba(0, 0, 0, 0.05);
                opacity: 0;
                transition-property: opacity, transform;
                transition-duration: .5s;
                z-index: 2;
            }
        }

        .prev {
            :focus {
                outline: none;
            }

            left: 0;

            .swiper-button-prev {
                left: 0;
                transform: translateX(-100%);
            }

            .icon-prev {
                font-size: 40px;
                position: absolute;
                top: 25%;
                left: 20%;
            }

            :hover {
                background: rgba(0, 0, 0, 0.1);

                .icon-prev {
                    background: none;
                }
            }
        }

        .next {
            :focus {
                outline: none;
            }

            right: 0;

            .swiper-button-next {
                right: 0;
                transform: translateX(100%);
            }

            .icon-next {
                font-size: 40px;
                position: absolute;
                top: 25%;
                left: 30%;
            }

            :hover {
                background: rgba(0, 0, 0, 0.1);

                .icon-next {
                    background: none;
                }
            }
        }
    }

</style>
