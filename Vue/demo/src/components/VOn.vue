<template>
    <div class="v-on">
        <h1>v-on</h1>
        <p>{{ message }}</p>
        <p v-once>使用v-once指令：{{ message }}</p>
        <button v-on:click="reverseMessage">逆转消息</button>
    </div>
</template>

<script>
import Bus from './Bus'

export default {
    name: 'VOn',
    props: ['name'],
    data () {
        return {
            message: 'Hello Vue.js!'
        }
    },
    methods: {
        reverseMessage () {
            this.message = this.message.split('').reverse().join('')
        }
    },
    mounted () {
        console.log(this.$route);
        console.log(this.name);
        
        Bus.$on('id-selected', function (id) {
            // ...
            alert(id)
        })
    }
}
</script>
