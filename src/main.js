import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'

import 'view-design/dist/styles/iview.css'

Vue.use(VueLazyload, {
  loading: require('./resources/images/playlist_300.png')
})

router.beforeEach((to, from, next) => {
  if (to.name) {
    next()
  } else {
    next(false)
  }
})

new Vue(
  {
    render: h => h(App),
    router,
    store
  }
).$mount('#app')
