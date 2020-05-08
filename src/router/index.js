import Vue from 'vue'
import VueRouter from 'vue-router'

import recommend from '../components/recommend/recommend'
import newSingerPage from '../components/singer/new_singer_page'
import rank from '../components/rank/rank'
import dissts from '../components/dissts/dissts'
import TopList from '../components/rank/toplist/toplist'
import DisstDetail from '../components/disst-detail/disst-detail'
import DisstList from '../components/dissts/disst-list/disst-list'
import SingerDetail from '../components/singer-detail/singer-detail'
import SongDetail from '../components/song_detail/song_detail'
import Search from '../components/search/search/search'

Vue.use(VueRouter)

// 配置路由
export default new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: recommend
    },
    {
      path: '/rank',
      name: 'rank',
      component: rank,
      children: [
        {
          path: ':id',
          name: 'toplist',
          component: TopList
        }
      ]
    },
    // {
    //   path: '/singer',
    //   name: 'singer',
    //   component: singer
    // },
    {
      path: '/singer',
      name: 'singer',
      component: newSingerPage
    },
    {
      path: '/singer_detail/:singerId',
      name: 'singer_detail',
      component: SingerDetail
    },
    {
      path: '/disst_detail/:disstId',
      name: 'disst_detail',
      component: DisstDetail
    },
    {
      path: '/songinfo/:songid',
      name: 'songinfo',
      component: SongDetail
    },
    {
      path: '/dissts',
      name: 'dissts',
      component: dissts,
      children: [
        {
          path: ':id',
          name: 'disst_list',
          component: DisstList
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    }
  ]
})
