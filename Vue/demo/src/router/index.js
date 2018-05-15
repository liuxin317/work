import Vue from 'vue'
import Router from 'vue-router'
import VModal from '@/components/VModal'
import VOn from '@/components/VOn'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/modal/:id/:token',
      name: 'VModal',
      component: VModal,
      props: {name: 'liuxin'}
    },
    {
      path: '/on',
      name: 'on',
      component: VOn,
      props: {name: 'liuxin2'}
    }
  ]
})
