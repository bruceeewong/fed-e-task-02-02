import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/other',
      name: 'OtherPage',
      component: () => import(/* webpackChunkName: "routes" */('@/components/OtherPage.vue'))
    }
  ]
})
