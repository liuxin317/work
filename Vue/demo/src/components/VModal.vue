<template>
    <div class="v-modal">
        <h1>v-modal</h1>
        <p>{{ message }}</p>
        <label for="">输入绑定input时更新数据</label>
        <input type="text" v-model="message" />
        <br>
        <label for="">输入绑定change时更新数据</label>
        <input type="text" v-model.lazy="message" />
        <hr>
        <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
        <label for="jack">Jack</label>
        <input type="checkbox" id="john" value="John" v-model="checkedNames">
        <label for="john">John</label>
        <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
        <label for="mike">Mike</label>
        <br>
        <span>Checked names: {{ checkedNames }}</span>
        <br>
        <button @click="handleClick">触发A事件id-selected</button>
        <br>
        路由参数：id = {{ $route.params.id }}, token = {{ $route.params.token }}
    </div>
</template>

<script>
import Bus from './Bus'

export default {
    name: 'VModal',
    props: ['name'],
    data () {
        return {
            message: 'Hello Vue!',
            checkedNames: [],
            pick: ''
        }
    },
    methods: {
        handleClick () {
            Bus.$emit('id-selected', 2);
        }
    },
    mounted () {
        console.log(this.$route);
        console.log(this.name);
    }
}
</script>