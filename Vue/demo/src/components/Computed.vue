<template>
    <div class="computed">
        <h1>计算属性：Computed</h1>
        <p>{{message}}</p>
        <p>计算属性：{{reversedMessage}}</p>
        <button @click="changeMessage">LiuXin</button>
        <button @click="reversedMessage = 'HuYang'">HuYang</button>
    </div>
</template>

<script>
export default {
    name: 'Computed',
    data () {
        return {
            message: 'Hello'
        }
    },
    computed: {
        // 计算属性
        reversedMessage: {
            get () {
                // this指向vm实例
                return this.message.split('').reverse().join('')
            },
            set (message) {
                this.message = message;
            }
        } 
    },
    methods: {
        changeMessage () {
            this.message += ' LiuXin'
        }
    }
}
</script>
