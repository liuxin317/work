import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex); // 安装vuex

var store = new Vuex.Store({
    debug: true,
    state: {
        count: 0,
        obj: {

        },
        filter: [1,3,2,6,5,67,12,56]
    },
    mutations: { // 更改store的唯一方式mutation
        inctrment (state, payload) {
            state.count += payload.amount 
        },
        addObjAttr (state, payload) { //添加新属性,赋予新对象
            state.obj = Object.assign({}, state.obj, payload)
        }
    },
    getters: {//对store进行过滤
        doneTodosCount (state) {
            return state.filter.sort((a, b) => (a - b))
        }
    },
    actions: { // 异步提交mutation
        incrementBy ({ commit }, mutate) {
            setTimeout(() => {
                commit(mutate.name, mutate.payload)
            }, 2000)
        }
    }
})

export default store;