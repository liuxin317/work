<template>
    <div class="watch">
        <h1>watch</h1>
        <p>{{ name }}</p>
        <button @click="name = '刘鑫'">变化</button>
    </div>
</template>

<script>
export default {
    name: 'Watch',
    data () {
        return {
            name: '胡杨'
        }
    },
    watch: {
        name (val, oldVal) {
            console.log('new: %s, old: %s', val, oldVal)
        }
    }
}
</script>