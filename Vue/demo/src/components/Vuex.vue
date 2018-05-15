<template>
    <div class="vuex">
        <h1>Vuex、Vue.use(Vuex)、store.commit触发更改、mutation</h1>
        <button @click="getCount">查看当前store中count的值{{ changeMessage }}</button>
        <button @click="getObj">查看当前store中obj的值{{ changeMessage }}</button>
        <button @click="getFilter">查看过滤后的store里的filter</button>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'Vuex',
    computed: {
        ...mapState([
            // 映射this.count为store.state.count
            'count',
            'obj'
        ]),
        ...mapGetters([
            'doneTodosCount'
        ]),
        changeMessage () {
            return 12
        }
    },
    methods: {
        getCount () {
            alert(this.count)
        }, 
        getObj () {
            alert(JSON.stringify(this.obj))
        },
        getFilter () {
            alert(this.doneTodosCount)
        }
    }
}
</script>
